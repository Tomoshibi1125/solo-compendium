import { artifacts as artifactItems } from "./artifacts";
import { baseEquipment } from "./items-base-equipment";
import { items as itemsPart1 } from "./items-part1";
import { items as itemsPart2 } from "./items-part2";
import { items as itemsPart3 } from "./items-part3";
import { items as itemsPart4 } from "./items-part4";
import { items as itemsPart5 } from "./items-part5";
import { items as itemsPart6 } from "./items-part6";
import { items as itemsPart7 } from "./items-part7";
import { items as itemsPart8 } from "./items-part8";
import { items as itemsPart9 } from "./items-part9";

export const allItems = [
	...itemsPart1,
	...itemsPart2,
	...itemsPart3,
	...itemsPart4,
	...itemsPart5,
	...itemsPart6,
	...itemsPart7,
	...itemsPart8,
	...itemsPart9,
	...baseEquipment,
	...artifactItems,
];
