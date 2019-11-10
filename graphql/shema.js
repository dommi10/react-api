const { ApolloServer, gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  "Type Categorie"
  type Categorie {
    id: Int!
    designation: String!
    produits: [Produit]
    totalProduit: Int
  }

  "Type Client"
  type Client {
    id: Int!
    user: User!
    nom: String!
    prenom: String
    tel: String!
    ville: String!
    pays: String!
  }

  "Type Commande"
  type Commande {
    id: Int!
    client: Client!
    produit: Produit!
    quantite: Int!
    datec: Date!
    etat: Etat!
  }

  "Type User"
  type Etat {
    id: Int!
    designation: String!
  }

  "Type paiement"
  type Paiement {
    id: Int!
    commande: Commande!
    montant: Float!
    datep: Date!
    methode: String!
  }

  "Type Produit"
  type Produit {
    id: Int!
    designation: String!
    descriptions: String!
    img: String!
    images: String!
    datea: Date!
    price: Float!
    quantite: Int!
    categorie: Categorie
  }

  "Type User"
  type User {
    id: Int!
    username: String!
    password: String!
    actif: Boolean!
    isAdmin: Boolean!
  }

  "type Login"
  type Login {
    id: Int
    username: String!
    password: String!
    token: String
  }

  "type Panier"
  type Panier {
    commande: [Commande]!
    totalArticle: Int
    totalPrices: Float
  }

  "Queries"
  type RootQuery {
    produits(limit: Int!, offset: Int!, orderBy: [[String]]): [Produit]

    clients(limit: Int!, offset: Int!, orderBy: [[String]]): [Client]

    categories(limit: Int!, offset: Int!, orderBy: [[String]]): [Categorie]

    produit(productId: Int!): Produit

    client(clientId: Int!): Client

    categorie(categorieId: Int!): Categorie

    commande(commandeId: Int!): Commande

    commandes(
      client: Int
      limit: Int!
      offset: Int!
      etat: Int
      orderBy: [[String]]
    ): [Commande]

    # paiement(
    #   userId: Int
    #   limit: Int!
    #   offset: Int!
    # ):[Paiement]

    uploads: [File]
  }

  # "Subscriptions"
  # type RootSubscription {
  #   personneAdded:Personne
  #   equipeAdded:Equipe
  # }

  "Mutations"
  type RootMutation {
    login(username: String!, passwords: String!): Login

    singleUpload(file: Upload!): File!

    addUser(username: String!, passwords: String!, isAdmin: Boolean): Login

    addCategorie(designation: String!): Categorie

    addProduit(
      designation: String!
      descriptions: String!
      img: String
      images: String
      price: Float!
      quantite: Int!
      categorieId: Int!
    ): Produit

    addClient(
      nom: String!
      prenom: String
      tel: String!
      ville: String!
      pays: String!
      passwords: String!
    ): Client

    addCommande(clientId: Int!, produitId: Int!, quantite: Int!): Commande
  }

  schema {
    query: RootQuery
    mutation: RootMutation
    # subscription: RootSubscription
  }
`;

module.exports = typeDefs;
