import View = require('./view')
import Data = require('./data')

class MockView extends View {
  notify = jest.fn()
}

class MockData extends Data {
  set() {
    this.notifyChangeToSubscribers()
  }
}

test('notify is called on change', () => {
  const view = new MockView()
  const data = new MockData()
  data.subscribe(view)
  data.set()
  expect(view.notify.mock.calls.length).toBe(1)
})

test('viewer can unsubscribe', () => {
  const view1 = new MockView()
  const view2 = new MockView()
  const data = new MockData()
  data.subscribe(view1)
  data.subscribe(view2)
  data.set()
  expect(view1.notify.mock.calls.length).toBe(1)
  expect(view2.notify.mock.calls.length).toBe(1)
  data.unsubscribe(view1)
  data.set()
  expect(view1.notify.mock.calls.length).toBe(1)
  expect(view2.notify.mock.calls.length).toBe(2)
})

test('viewer can subscribe only once', () => {
  const view = new MockView()
  const data = new MockData()
  data.subscribe(view)
  data.subscribe(view)
  data.set()
  expect(view.notify.mock.calls.length).toBe(1)
  data.unsubscribe(view)
  data.set()
  expect(view.notify.mock.calls.length).toBe(1)
})
