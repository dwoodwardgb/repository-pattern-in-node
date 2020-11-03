# My TS-first approach to the repository pattern with Node, Zod, and Mongo

I was heavily inspired by [DevMastery's implementation of clean architecture in Node](https://github.com/dev-mastery/comments-api) and I wanted to try and achieve something similar but with a typescript-first approach.

The main idea behind this implementation was to try and deliniate which fields are visible and mutable in each CRUD action.

## Todo

[ ] Generalize the pattern so that a "repository" can be created when given Zod parsers for each of its 3 (CRU) types.
