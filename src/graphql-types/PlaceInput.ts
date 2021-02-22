import { InputType, Field } from 'type-graphql';

@InputType()
export class PlaceInput {
  @Field({ nullable: true })
  id?: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  imageUrl?: string;
}
