import { Args, Query, Resolver } from '@nestjs/graphql'

import { CategoryService } from './category.service'
import { CategoryModel } from './models/category.model'

@Resolver('Categoty')
export class CategoryResolver {
	constructor(private readonly categoryService: CategoryService) {}

	@Query(() => [CategoryModel], { name: 'findAllCategories' })
	async findAll() {
		return await this.categoryService.findAll()
	}

	@Query(() => [CategoryModel], { name: 'findRadndomCategories' })
	async findRandom() {
		return await this.categoryService.findRandom()
	}

	@Query(() => CategoryModel, { name: 'findCategoryBySlug' })
	async findBySlug(@Args('input') slug: string) {
		return await this.categoryService.findBySlug(slug)
	}
}
