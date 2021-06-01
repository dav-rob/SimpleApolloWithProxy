const { ApolloServer, gql } = require('apollo-server')
const axios = require('axios')
const { bootstrap: bootstrapGlobalAgent } = require('global-agent');
/**
 * Set environment to the following, change USE_PROXY to false to turn off proxy
 * 
    export NODE_TLS_REJECT_UNAUTHORIZED="0"
    export GLOBAL_AGENT_HTTP_PROXY="http://127.0.0.1:8866/"
    export GLOBAL_AGENT_HTTPS_PROXY="http://127.0.0.1:8866/"
    export ROARR_LOG=true
    export DEPLOY_ENV=DEV
    export USE_PROXY=true
 */
console.log("USE_PROXY=" + process.env.USE_PROXY)
if (process.env.USE_PROXY) {
    // Setup global support for environment variable based proxy configuration.
    bootstrapGlobalAgent();
}

const typeDefs = gql`
    type User {
        id: ID
        login: String
        avatar_url: String
    }

    type Query {
        users: [User]
    }
`

const resolvers = {
    Query: {
        users: async () => {
            try {
                const users = await axios.get('https://api.github.com/users')
                console.log("users.data", users.data)
                return users.data.map(({ id, login, avatar_url }) => ({
                    id,
                    login,
                    avatar_url 
                }))
            } catch (error) {
                throw error
            }
        },
    },
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.listen().then(({ url }) => console.log(`Server ready at ${url}`))
