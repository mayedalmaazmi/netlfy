const { GraphQLServerLambda } = require('graphql-yoga')
const { queryType, intArg, makeSchema, objectType } = require('@nexus/schema');
const data = require('./data')

const File = objectType({
  name: 'File',
  definition(t) {
    t.id('id')
    t.string('filename')
    t.int('size')
    t.string('url', ({filename}) => `http://d1wo0lqludkeyi.cloudfront.net/${filename}`)
  },
})

const Query = queryType({
  definition(t) {
    t.field('file', {
      type: File,
      args: { id: intArg({nullable: false}) },
      resolve: (parent, { id }) => data.find(item => item.id === id),
    })
  },
})

const schema = makeSchema({
  types: [Query, File],
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/typings.ts',
  },
})

const server = new GraphQLServerLambda({
  schema,
})


exports.handler = lambda.graphqlHandler
