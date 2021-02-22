import { Resolver, Query, Arg, Mutation, Ctx } from 'type-graphql';
import { plainToClass } from 'class-transformer';
import { Place } from '../entity/Place';
import { User } from '../entity/User';
import { PlaceInput } from '../graphql-types/PlaceInput';
import { getUserId } from '../utils';
import { Request } from 'express';

@Resolver(() => Place)
export class PlaceResolver {
  //@Query assume certain properties on a given class or function
  @Query(() => Place, { nullable: true })
  async place(@Arg('id') id: number): Promise<Place | undefined> {
    return await Place.findOne(id, { relations: ['user'] });
  }

  @Query(() => [Place], {
    description: 'Get all places from around world'
  })
  async places(): Promise<Place[]> {
    const places = await Place.find({ relations: ['user'] });
    return places;
  }

  @Mutation(() => Place)
  async createPlace(
    @Arg('place') placeInput: PlaceInput,
    @Ctx() ctx: { req: Request }
  ): Promise<Place> {
    const userId = getUserId(ctx);
    if (userId) {
      const place = plainToClass(Place, {
        description: placeInput.description,
        title: placeInput.title,
        imageUrl: placeInput.imageUrl || '',
        creationDate: new Date()
      });
      const user = await User.findOne(userId);
      const newPlace = await Place.create({
        ...place,
        user
      }).save();
      return newPlace;
    }

    throw Error('User not found');
  }

  @Mutation(() => Place)
  async updatePlace(
    @Arg('place') placeInput: PlaceInput,
    @Ctx() ctx: { req: Request }
  ): Promise<Place> {
    const userId = getUserId(ctx);
    if (userId) {
      const { id, title, description, imageUrl } = placeInput;
      const place = await Place.findOne({
        where: { id, user: { id: userId } },
        relations: ['user']
      });
      if (place) {
        place.title = title;
        place.description = description;
        place.imageUrl = imageUrl;
        place.save();
        return place;
      }

      throw new Error('Place not found');
    }

    throw new Error('User not found');
  }

  @Mutation(() => String)
  async deletePlace(
    @Arg('id') id: string,
    @Ctx() ctx: { req: Request }
  ): Promise<String | undefined> {
    const userId = getUserId(ctx);
    if (userId) {
      const deleted = await Place.delete({ id, user: { id: userId } });
      if (deleted) {
        return id;
      }
      throw new Error('Place not deleted. Please try again');
    }
    throw new Error('User not found. Please try again');
  }
}
