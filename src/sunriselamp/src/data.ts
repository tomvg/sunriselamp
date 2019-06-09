import View = require('./view')

abstract class Data {
  private subscribers: View[] = []

  public subscribe(viewer: View): void {
    if(this.subscribers.find(v => v === viewer)) {
      // Already subscribed
      return
    }
    this.subscribers.push(viewer)
    if(this.subscribers.length === 1) {
      this.onFirstSubscriber()
    }
    viewer.notify()
  }

  public unsubscribe(viewer: View): void {
    const index = this.subscribers.findIndex(v => v === viewer)
    if(index >= 0) {
      this.subscribers.splice(index, 1)
      if(this.subscribers.length === 0) {
        this.onNoMoreSubscribers()
      }
    }
  }

  protected notifyChangeToSubscribers(): void {
    for(const viewer of this.subscribers) {
      viewer.notify()
    }
  }

  protected onFirstSubscriber() {}
  protected onNoMoreSubscribers() {}
}

export = Data
