import { MetaBuilding, defaultBuildingVariant } from "../meta_building";
import { enumItemProcessorTypes, ItemProcessorComponent } from "../components/item_processor";
import { GameRoot } from "../root";
import { Entity } from "../entity";
import { T } from "../../translations";
import { formatItemsPerSecond } from "../../core/utils";
import { ItemEjectorComponent } from "../components/item_ejector";
import { ItemAcceptorComponent, enumItemAcceptorItemFilter } from "../components/item_acceptor";
import { enumDirection, Vector } from "../../core/vector";

/** @enum {string} */
export const enumFlipperVariants = { vertical: "vertical" };

export class MetaFlipperBuilding extends MetaBuilding {
    constructor() {
        super("flipper");
    }

    getSilhouetteColor() {
        return "#7dc6cd";
    }

    /**
     * @param {GameRoot} root
     * @param {string} variant
     * @returns {Array<[string, string]>}
     */
    getAdditionalStatistics(root, variant) {
        const speed = root.hubGoals.getProcessorBaseSpeed(
            variant === enumFlipperVariants.vertical
                ? enumItemProcessorTypes.flipperVertical
                : enumItemProcessorTypes.flipper
        );
        return [[T.ingame.buildingPlacement.infoTexts.speed, formatItemsPerSecond(speed)]];
    }

    /**
     *
     * @param {GameRoot} root
     */
    getAvailableVariants(root) {
        // if (root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_rotater_ccw)) {
        //     return [defaultBuildingVariant, enumRotaterVariants.ccw];
        // }
        return [defaultBuildingVariant, enumFlipperVariants.vertical];
    }

    /**
     * @param {GameRoot} root
     */
    getIsUnlocked(root) {
        // return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_rotater);
        return true;
    }

    /**
     * Creates the entity at the given location
     * @param {Entity} entity
     */
    setupEntityComponents(entity) {
        entity.addComponent(
            new ItemProcessorComponent({
                inputsPerCharge: 1,
                processorType: enumItemProcessorTypes.flipper,
            })
        );

        entity.addComponent(
            new ItemEjectorComponent({
                slots: [{ pos: new Vector(0, 0), direction: enumDirection.top }],
            })
        );
        entity.addComponent(
            new ItemAcceptorComponent({
                slots: [
                    {
                        pos: new Vector(0, 0),
                        directions: [enumDirection.bottom],
                        filter: enumItemAcceptorItemFilter.shape,
                    },
                ],
            })
        );
    }

    /**
     *
     * @param {Entity} entity
     * @param {number} flipperVariant
     * @param {string} variant
     */
    updateVariants(entity, flipperVariant, variant) {
        switch (variant) {
            case defaultBuildingVariant: {
                entity.components.ItemProcessor.type = enumItemProcessorTypes.flipper;
                break;
            }
            case enumFlipperVariants.vertical: {
                entity.components.ItemProcessor.type = enumItemProcessorTypes.flipperVertical;
                break;
            }
            default:
                assertAlways(false, "Unknown flipper variant: " + variant);
        }
    }
}
