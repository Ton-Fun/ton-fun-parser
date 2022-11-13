import {MongoClient} from 'mongodb'

export default (client: MongoClient) => {
    console.log(client && true)
}