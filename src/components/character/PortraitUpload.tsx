import { Image as ImageIcon, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { compressImage } from "@/lib/imageOptimization";
import { logger } from "@/lib/logger";

const PORTRAIT_BUCKET = "character-portraits";
const PUBLIC_OBJECT_MARKER = `/storage/v1/object/public/${PORTRAIT_BUCKET}/`;
const getPortraitStorageOrigin = (): string => {
	const { data } = supabase.storage.from(PORTRAIT_BUCKET).getPublicUrl("");
	return new URL(data.publicUrl).origin;
};

const decodeSafePathSegment = (segment: string): string | null => {
	if (!segment || /%2f|%5c/i.test(segment)) return null;
	try {
		const decoded = decodeURIComponent(segment);
		if (
			!decoded ||
			decoded === "." ||
			decoded === ".." ||
			decoded.includes("/") ||
			decoded.includes("\\")
		) {
			return null;
		}
		return decoded;
	} catch {
		return null;
	}
};

/**
 * Extract only portrait object paths created for this character. Both the new
 * owner-first layout and the legacy portraits/<file> layout are understood;
 * unrelated URLs are never converted into local deletion targets.
 */
export const parsePortraitObjectPath = (
	publicUrl: string,
	characterId: string,
	ownerId: string,
	storageOrigin: string,
): string | null => {
	try {
		const url = new URL(publicUrl);
		if (url.origin !== new URL(storageOrigin).origin) return null;
		const pathname = url.pathname;
		const markerIndex = pathname.indexOf(PUBLIC_OBJECT_MARKER);
		if (markerIndex < 0) return null;

		const encodedPath = pathname.slice(
			markerIndex + PUBLIC_OBJECT_MARKER.length,
		);
		if (!encodedPath) return null;
		const segments = encodedPath.split("/").map(decodeSafePathSegment);
		if (segments.some((segment) => segment === null)) return null;

		const decodedSegments = segments as string[];
		const escapedCharacterId = characterId.replace(
			/[.*+?^${}()|[\]\\]/g,
			"\\$&",
		);
		const expectedFileName = new RegExp(
			`^${escapedCharacterId}-\\d+\\.webp$`,
			"i",
		);
		const fileName = decodedSegments.at(-1);
		if (!fileName || !expectedFileName.test(fileName)) return null;

		if (
			decodedSegments.length === 3 &&
			decodedSegments[0] === ownerId &&
			decodedSegments[1] === "portraits"
		) {
			return decodedSegments.join("/");
		}

		if (decodedSegments.length === 2 && decodedSegments[0] === "portraits") {
			return decodedSegments.join("/");
		}
	} catch {
		return null;
	}

	return null;
};

export function PortraitUpload({
	characterId,
	currentPortraitUrl,
	onUploadComplete,
}: {
	characterId: string;
	currentPortraitUrl?: string | null;
	onUploadComplete?: (url: string) => void;
}) {
	const [uploading, setUploading] = useState(false);
	const [storedPortraitUrl, setStoredPortraitUrl] = useState<string | null>(
		currentPortraitUrl || null,
	);
	const [preview, setPreview] = useState<string | null>(
		currentPortraitUrl || null,
	);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { toast } = useToast();

	useEffect(() => {
		const nextUrl = currentPortraitUrl || null;
		setStoredPortraitUrl(nextUrl);
		setPreview(nextUrl);
	}, [currentPortraitUrl]);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			toast({
				title: "Invalid file type",
				description: "Please select an image file.",
				variant: "destructive",
			});
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			toast({
				title: "File too large",
				description: "Please select an image smaller than 5MB.",
				variant: "destructive",
			});
			return;
		}

		const reader = new FileReader();
		reader.onload = (event) => {
			setPreview(event.target?.result as string);
		};
		reader.readAsDataURL(file);
	};

	const removeObject = async (path: string, context: string) => {
		const { error } = await supabase.storage
			.from(PORTRAIT_BUCKET)
			.remove([path]);
		if (error) {
			logger.warn(`Could not remove ${context} portrait object`, error);
		}
		return error;
	};

	const handleUpload = async () => {
		const file = fileInputRef.current?.files?.[0];
		if (!file) return;

		setUploading(true);

		try {
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();
			if (userError || !user) {
				throw (
					userError ?? new Error("You must be signed in to upload a portrait.")
				);
			}

			const compressedBlob = await compressImage(file, {
				maxWidth: 512,
				maxHeight: 512,
				quality: 0.85,
				format: "webp",
			});

			const fileName = `${characterId}-${Date.now()}.webp`;
			const filePath = `${user.id}/portraits/${fileName}`;
			const previousPath = storedPortraitUrl
				? parsePortraitObjectPath(
						storedPortraitUrl,
						characterId,
						user.id,
						getPortraitStorageOrigin(),
					)
				: null;

			const { error: uploadError } = await supabase.storage
				.from(PORTRAIT_BUCKET)
				.upload(filePath, compressedBlob, {
					cacheControl: "3600",
					upsert: false,
					contentType: "image/webp",
				});
			if (uploadError) throw uploadError;

			const {
				data: { publicUrl },
			} = supabase.storage.from(PORTRAIT_BUCKET).getPublicUrl(filePath);

			const { error: updateError } = await supabase
				.from("characters")
				.update({ portrait_url: publicUrl })
				.eq("id", characterId);

			if (updateError) {
				await removeObject(filePath, "rolled-back");
				throw updateError;
			}

			setStoredPortraitUrl(publicUrl);
			setPreview(publicUrl);
			if (fileInputRef.current) fileInputRef.current.value = "";
			onUploadComplete?.(publicUrl);

			if (previousPath && previousPath !== filePath) {
				await removeObject(previousPath, "superseded");
			}

			toast({
				title: "Portrait uploaded",
				description: "Character portrait has been updated.",
			});
		} catch {
			toast({
				title: "Upload failed",
				description: "Could not upload portrait. Please try again.",
				variant: "destructive",
			});
		} finally {
			setUploading(false);
		}
	};

	const handleRemove = async () => {
		if (preview !== storedPortraitUrl) {
			setPreview(storedPortraitUrl);
			if (fileInputRef.current) fileInputRef.current.value = "";
			return;
		}
		if (!storedPortraitUrl) return;

		setUploading(true);
		try {
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();
			if (userError || !user) {
				throw (
					userError ?? new Error("You must be signed in to remove a portrait.")
				);
			}

			const objectPath = parsePortraitObjectPath(
				storedPortraitUrl,
				characterId,
				user.id,
				getPortraitStorageOrigin(),
			);
			const { error: updateError } = await supabase
				.from("characters")
				.update({ portrait_url: null })
				.eq("id", characterId);
			if (updateError) throw updateError;

			const cleanupError = objectPath
				? await removeObject(objectPath, "removed")
				: null;
			setStoredPortraitUrl(null);
			setPreview(null);
			if (fileInputRef.current) fileInputRef.current.value = "";
			onUploadComplete?.("");

			toast(
				cleanupError
					? {
							title: "Portrait reference removed",
							description:
								"The portrait was cleared, but its legacy file could not be deleted automatically.",
							variant: "destructive",
						}
					: {
							title: "Portrait removed",
							description: "Character portrait has been removed.",
						},
			);
		} catch {
			toast({
				title: "Remove failed",
				description: "Could not remove portrait.",
				variant: "destructive",
			});
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-3">
				{preview ? (
					<div className="relative">
						<OptimizedImage
							src={preview}
							alt="Character portrait"
							className="w-24 h-24 rounded-lg object-cover border border-border"
							size="small"
						/>
						<Button
							variant="destructive"
							size="icon"
							aria-label="Remove"
							className="absolute -top-2 -right-2 h-6 w-6"
							onClick={handleRemove}
							disabled={uploading}
						>
							<X className="w-3 h-3" />
						</Button>
					</div>
				) : (
					<div className="w-24 h-24 rounded-lg border border-dashed border-muted-foreground/50 flex items-center justify-center bg-muted/30">
						<ImageIcon className="w-8 h-8 text-muted-foreground" />
					</div>
				)}

				<div className="flex-1 space-y-2">
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileSelect}
						accept="image/*"
						className="hidden"
						title="Upload Portrait"
						placeholder="No file chosen"
					/>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => fileInputRef.current?.click()}
							className="gap-2"
							disabled={uploading}
						>
							<Upload className="w-4 h-4" />
							{storedPortraitUrl ? "Change" : "Upload"}
						</Button>
						{preview && preview !== storedPortraitUrl && (
							<Button
								variant="default"
								size="sm"
								onClick={handleUpload}
								disabled={uploading}
								className="gap-2"
							>
								{uploading ? "Uploading..." : "Save"}
							</Button>
						)}
					</div>
					<p className="text-xs text-muted-foreground">
						JPG, PNG, or GIF. Max 5MB
					</p>
				</div>
			</div>
		</div>
	);
}
