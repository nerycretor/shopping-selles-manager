import { Client, Databases } from "appwrite"

export const client = new Client()
                    .setEndpoint('https://cloud.appwrite.io/v1')
                    .setProject('6634de3e003dbb88f860')

export const database = new Databases(client)