import { artifacts as artifactItems } from "./artifacts";
import { baseEquipment } from "./items-base-equipment";
import { items_part1 as itemsPart1 } from "./items-part1";
import { items_part2 as itemsPart2 } from "./items-part2";
import { items_part3 as itemsPart3 } from "./items-part3";
import { items_part4 as itemsPart4 } from "./items-part4";
import { items_part5 as itemsPart5 } from "./items-part5";
import { items_part6 as itemsPart6 } from "./items-part6";
import { items_part7 as itemsPart7 } from "./items-part7";
import { items_part8 as itemsPart8 } from "./items-part8";
import { items_part9 as itemsPart9 } from "./items-part9";

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
