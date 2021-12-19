import { Column } from '../decorators/column';
import { Contract } from '../decorators/contract';

@Contract({
  restriction: 'editors',
  editors: ['0x25a39f7E0b8b2D6b2Ebe1f155B09EE6FfB7D11F9'],
})
export class Test {
  @Column({ type: 'int' })
  test: number;

  @Column()
  test1: string;
}
