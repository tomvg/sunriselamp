/* Any viewer needs to implement at least a notify function before it can
   subsribe to data */
abstract class View {
  abstract notify(): void
}

export = View
