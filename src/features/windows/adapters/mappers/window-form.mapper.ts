import { WindowForm } from '../forms/window.form.schema';

export function toWindowPayload(data: WindowForm) {
  const {
    sampleImages,
    technicalImage,
    subWindows,
    horizontalProfiles,
    verticalProfiles,
    chapeWindows,
    windowComplexity,
    ...rest
  } = data;

  return {
    createWindowInput: {
      ...rest,
      technicalImageGuid: technicalImage?.guid,
      sampleImageGuids: sampleImages?.map((image) => image.guid) || [],
      subWindows: subWindows?.map((s) => ({
        chapeWindows: chapeWindows
          .filter(
            (c) => s.windowType === subWindows[Number(c.subWindow)].windowType
          )
          .map(({ chapeInventoryItemGuid, quantity }) => ({
            chapeInventoryItemGuid,
            quantity,
          })),
        horizontalProfiles: horizontalProfiles
          .filter(
            (c) => s.windowType === subWindows[Number(c.subWindow)].windowType
          )
          .map(({ inventoryItemSKU, quantity, size }) => ({
            inventoryItemSKU,
            quantity,
            size,
            windowType: s.windowType,
          })),
        verticalProfiles: verticalProfiles
          .filter(
            (c) => s.windowType === subWindows[Number(c.subWindow)].windowType
          )
          .map(({ inventoryItemSKU, quantity, size }) => ({
            inventoryItemSKU,
            quantity,
            size,
            windowType: s.windowType,
          })),
        projectionQuantity: s.projectionQuantity,
        windowType: s.windowType,
      })),
      windowTypes: subWindows?.map((s) => s.windowType),
    },
  };
}

export function toWindowForm(data: any) {
  return {
    ...data,
  };
}
