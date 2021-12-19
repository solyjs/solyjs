import { Column } from '../decorators/column';
import { Contract } from '../decorators/contract';

@Contract()
export class Test {
  @Column({ type: 'uint256' })
  test: number;

  @Column()
  test1: string;
}
