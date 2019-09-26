const spidevice:any = jest.genMockFromModule('spi-device')
spidevice.openSync = function(a: any,b:any,c:any) {
  return { transferSync: function(data: any) {}}
}
module.exports = spidevice
