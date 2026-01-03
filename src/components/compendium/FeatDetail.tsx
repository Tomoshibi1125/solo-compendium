import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface FeatData {
  id: string;
  name: string;
  description: string;
  prerequisites?: string;
  benefits?: string[];
  tags?: string[];
  source_book?: string;
}

export const FeatDetail = ({ data }: { data: FeatData }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <SystemWindow title={data.name.toUpperCase()}>
        <div className="space-y-4">
          <p className="text-foreground">{data.description}</p>
          
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </SystemWindow>

      {/* Prerequisites */}
      {data.prerequisites && (
        <SystemWindow title="PREREQUISITES">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-foreground">{data.prerequisites}</p>
          </div>
        </SystemWindow>
      )}

      {/* Benefits */}
      {data.benefits && data.benefits.length > 0 && (
        <SystemWindow title="BENEFITS">
          <ul className="space-y-3">
            {data.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{benefit}</span>
              </li>
            ))}
          </ul>
        </SystemWindow>
      )}

      {data.source_book && (
        <div className="flex justify-end">
          <Badge variant="outline">{data.source_book}</Badge>
        </div>
      )}
    </div>
  );
};