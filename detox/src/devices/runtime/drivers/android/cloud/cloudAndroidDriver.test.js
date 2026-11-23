// @ts-nocheck
describe('Cloud Android driver', () => {
  let invocationManager;
  let uut;

  beforeEach(() => {
    jest.mock('../../../../../utils/logger');

    invocationManager = {
      execute: jest.fn(),
      executeCloudPlatform: jest.fn(),
    };

    const CloudAndroidDriver = require('./cloudAndroidDriver');
    uut = new CloudAndroidDriver({ client: {}, eventEmitter: {}, invocationManager });
  });

  describe('generateViewHierarchyXml', () => {
    const viewHierarchyXml = '<ViewHierarchy><android.widget.FrameLayout /></ViewHierarchy>';

    it.each([false, true])('should invoke Detox.generateViewHierarchyXml(%s) on the device', async (shouldInjectTestIds) => {
      invocationManager.execute.mockResolvedValue({ result: viewHierarchyXml });

      await uut.generateViewHierarchyXml(shouldInjectTestIds);

      expect(invocationManager.execute).toHaveBeenCalledWith({
        target: { type: 'Class', value: 'com.wix.detox.Detox' },
        method: 'generateViewHierarchyXml',
        args: [{ type: 'boolean', value: shouldInjectTestIds }],
      });
      expect(invocationManager.executeCloudPlatform).not.toHaveBeenCalled();
    });

    it('should return the XML from the device', async () => {
      invocationManager.execute.mockResolvedValue({ result: viewHierarchyXml });

      await expect(uut.generateViewHierarchyXml(false)).resolves.toEqual(viewHierarchyXml);
    });
  });
});
