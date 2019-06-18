import View = require('./view')

/* Abstract class that allows any observers to be notified whenever
   there is a change to the data.
   Observers can subscribe only once.
   onFirstSubscriber and onNoMoreSubscribers can optionally be implemented
   by a derived class in order to take actions on these events. */
abstract class Data {
  private subscribers: View[] = []

  public subscribe(viewer: View): void {
    if(this.isSubscribed(viewer)) {
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

  public isSubscribed(viewer: View) {
    return this.subscribers.find(v => v === viewer) != undefined
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
