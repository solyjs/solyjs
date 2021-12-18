import { Column } from '../decorators/column';
import { Contract } from '../decorators/contract';
import { Address } from '../types/address';

@Contract()
export class User {
  @Column()
  public name: string;

  @Column()
  public lastName: string;
}

@Contract()
export class Baci {
  @Column()
  public name: string;

  @Column()
  public lastName: string;

  @Column()
  public kita: string;
}
