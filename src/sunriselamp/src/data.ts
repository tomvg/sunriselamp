import View = require('./view')

abstract class Data {
  private subscribers: View[] = []

  public subscribe(viewer: View): void {
    if(this.subscribers.find(v => v === viewer)) {
      // Already subscribed
      return
    }
    this.subscribers.push(viewer)
  }

  public unsubscribe(viewer: View): void {
    const index = this.subscribers.findIndex(v => v === viewer)
    this.subscribers.splice(index, 1)
  }

  protected notifyChangeToSubscribers(): void {
    for(const viewer of this.subscribers) {
      viewer.notify()
    }
  }
}

export = Data
