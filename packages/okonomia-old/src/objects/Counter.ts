import DurableObject, { Route, Visible } from './DurableObject';

class Counter extends DurableObject {
  @Visible
  value: number = 0;

  async initialize() {
    const value = await this.state.storage.get<number | null>('value');
    this.value = value || 0;
  }

  async writeValue() {
    await this.state.storage.put('value', this.value);
    return this.value;
  }

  @Route('/')
  async read() {}

  @Route('/increment')
  async increment() {
    ++this.value;
    await this.writeValue();
  }

  @Route('/decrement')
  async decrement() {
    --this.value;
    await this.writeValue();
  }

  @Route('/reset')
  async reset() {
    this.value = 0;
    await this.writeValue();
  }
}

export default Counter;
