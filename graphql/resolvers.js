const { PubSub, ApolloError, withFilter } = require("apollo-server-express");
const bcrypt = require("bcrypt");
const sequelize = require("../models/index");
const pubsub = new PubSub();
const PERSONNE_ADDED = "PERSONNE_ADDED";
const EQUIPE_ADDED = "EQUIPE_ADDED";
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid/v4");
let qArgs;
let totalA = 0;

const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value;
    },
    parseLiteral(ast) {
      return ast.kind === Kind.STRING
        ? [
            new Date(ast.value).getMonth() + 1 < 10
              ? "0" + (new Date(ast.value).getMonth() + 1)
              : new Date(ast.value).getMonth() + 1,
            new Date(ast.value).getDate() < 10
              ? "0" + new Date(ast.value).getDate()
              : new Date(ast.value).getDate(),
            new Date(ast.value).getFullYear()
          ].join("-") +
            " " +
            [
              new Date(ast.value).getHours() < 10
                ? "0" + new Date(ast.value).getHours()
                : new Date(ast.value).getHours(),
              new Date(ast.value).getMinutes() < 10
                ? "0" + new Date(ast.value).getMinutes()
                : new Date(ast.value).getMinutes(),
              new Date(ast.value).getSeconds() < 10
                ? "0" + new Date(ast.value).getSeconds()
                : new Date(ast.value).getSeconds()
            ].join(":")
        : null;
    }
  }),
  Produit: {
    categorie: (parent, args, { dataLoader }) =>
      dataLoader.categorieLoader.load(parent.categorie)
  },
  Categorie: {
    produits: (parent, args, { dataLoader }) =>
      dataLoader.produitLoader.load(parent.id),
    totalProduit: async (parent, args, { models }) => {
      const x = await models.produit.count({
        where: {
          categorie: parent.id
        }
      });
      return x;
    }
  },
  Client: {
    user: (parent, args, { models }) =>
      models.user.findOne({
        where: {
          id: parent.refUser
        }
      })
  },
  Commande: {
    client: (parent, args, { models }) =>
      models.client.findOne({
        where: {
          id: parent.client
        }
      }),
    produit: (parent, args, { models }) =>
      models.produit.findOne({
        where: {
          id: parent.produit
        }
      }),
    etat: (parent, args, { models }) =>
      models.etat.findOne({
        where: {
          id: parent.etat
        }
      })
  },
  Panier: {
    commande: async (parent, args, { dataLoader, models }) => {
      return dataLoader.commandeLoader.load(parent.id);
    }
  },
  RootQuery: {
    produit: async (parent, args, { models, user }) => {
    //   if (!user) return new Error("vous devez vous authentifiez d'abord");
      try {
        //   if (!args.orderBy) args.orderBy = [["id", "DESC"]];
        return await models.produit.findOne({
          where: {
            id: args.productId
          }
        });
      } catch (error) {
        return new Error("une erreur est survenue, reessayer!");
      }
    },
    client: async (parent, args, { models, user }) => {
      if (!user) return new Error("vous devez vous authentifiez d'abord");
      try {
        return await models.client.findOne({
          where: {
            id: args.clientId
          }
        });
      } catch (error) {
        return new Error("une erreur est survenue, reessayer!");
      }
    },
    commande: async (parent, args, { models, user }) => {
      if (!user) return new Error("vous devez vous authentifiez d'abord");
      try {
        return await models.commande.findOne({
          where: {
            id: args.commandeId
          }
        });
      } catch (error) {
        return new Error("une erreur est survenue, reessayer!");
      }
    },
    categorie: async (parent, args, { models, user }) => {
    //   if (!user) return new Error("vous devez vous authentifiez d'abord");
      try {
        //   if (!args.orderBy) args.orderBy = [["id", "DESC"]];
        return await models.categorie.findOne({
          where: {
            id: args.categorieId
          }
        });
      } catch (error) {
        return new Error("une erreur est survenue, reessayer!");
      }
    },
    produits: (parent, args, { models, user }) => {
    //   if (!user) return new Error("vous devez vous authentifiez d'abord");
      try {
        if (!args.orderBy) args.orderBy = [["id", "DESC"]];
        return models.produit.findAll({
          limit: args.limit,
          offset: args.offset,
          order: args.orderBy
        });
      } catch (error) {
        return new Error("une erreur est survenue, reessayer!");
      }
    },
    commandes: (parent, args, { models, user }) => {
      if (!user) return new Error("vous devez vous authentifiez d'abord");
      try {
        let val;
        if (!args.orderBy) args.orderBy = [["id", "DESC"]];

        if (args.client || args.etat) {
          switch (args) {
            case args.client && !args.etat:
              val = models.commande.findAll({
                limit: args.limit,
                offset: args.offset,
                order: args.orderBy,
                where: {
                  etat: args.etat
                }
              });
              break;
            case !args.client && args.etat:
              val = models.commande.findAll({
                limit: args.limit,
                offset: args.offset,
                order: args.orderBy,
                where: {
                  etat: args.etat
                }
              });
              break;
            default:
              val = models.commande.findAll({
                limit: args.limit,
                offset: args.offset,
                order: args.orderBy,
                where: {
                  etat: args.etat,
                  client: args.client
                }
              });
              break;
          }
        } else
          val = models.commande.findAll({
            limit: args.limit,
            offset: args.offset,
            order: args.orderBy
          });
        return val;
      } catch (error) {
        console.log(error);
        return new Error("une erreur est survenue, reessayer! ");
      }
    },

    clients: (parent, args, { models, user }) => {
      if (!user) return new Error("vous devez vous authentifiez d'abord");
      try {
        if (!args.orderBy) args.orderBy = [["id", "DESC"]];
        return models.client.findAll({
          limit: args.limit,
          offset: args.offset,
          order: args.orderBy
        });
      } catch (error) {
        return new Error("une erreur est survenue, reessayer!");
      }
    },
    categories: (parent, args, { models, user }) => {
    //   if (!user) return new Error("vous devez vous authentifiez d'abord");
      try {
        if (!args.orderBy) args.orderBy = [["id", "DESC"]];
        return models.categorie.findAll({
          limit: args.limit,
          offset: args.offset,
          order: args.orderBy
        });
      } catch (error) {
        return new Error("une erreur est survenue, reessayer!");
      }
    },
    
  },
  RootMutation: {
    login: async (parent, args, { models }) => {
        try {
          const user = await models.user.findOne({
            where: {
              username: args.username
            }
          });
          if (!user) {
            return new Error("le nom d'utilisateur ou le mot de passe incorrect");
          }
          const res = await bcrypt.compare(args.passwords, user.password);
          if (!res)
            return new Error("le nom d'utilisateur ou le mot de passe incorrect");
          const token = await jwt.sign(
            {
              userId: user.id
            },
            ',(F-h"FL&,YP,P7xf#FeBT/K9>#o',
            {
              expiresIn: "24h"
            }
          );
          user.token = token;
          return user;
        } catch (error) {
          console.log(error);
          return new Error("Une erreur est survenue");
        }
      },
    singleUpload: async (parent, args, { models, user }) => {
      if (!user) return new Error("vous devez vous authentifiez d'abord");
      const { filename, mimetype, createReadStream } = await args.file;
      let extension = path.extname(filename);
      let f;
      let filesize = 0;
      let stream = createReadStream();
      stream.on("data", chunk => {
        filesize += chunk.length;
      });
      stream.once("end", () => {
        const f = fs.createWriteStream("./storage/" + uuidv4() + extension);
        fs.readFile(stream.path, (err, data) => {
          f.write(data);
        });
      });
      stream.on(
        "error",
        () => new Error("une erreur est survenue, veiller reessayer !")
      );
      return f;
    },
    addUser: async (parent, args, { models, user }) => {
      try {
        // console.log(args.dateCreation + ' Z');

        users = await models.user.findOne({
          //   limit: 1,
          order: [["id", "DESC"]]
        });
        args.username = "user0";
        if (users) args.username += users.id + 1;
        else {
          args.username = "user01";
        }

        const password = await bcrypt.hash(args.passwords, 12);

        const val = await models.user.create({
          username: args.username,
          password: password,
          isAdmin: args.isAdmin
        });
        return val;
      } catch (error) {
        console.log(error);
        return new Error("une erreur est survenue, veiller reessayer !");
      }
    },
    addClient: async (parent, args, { models }) => {
      try {
        client = await models.client.findOne({
          where: {
            nom: args.nom,
            prenom: args.prenom
          }
        });
        if (client)
          return new Error("ce compte existe deja, veiller reessayer !");
        users = await models.user.findOne({
          //   limit: 1,
          order: [["id", "DESC"]]
        });
        args.username = "user0";
        if (users) args.username += users.id + 1;
        else {
          args.username = "user01";
        }

        const password = await bcrypt.hash(args.passwords, 12);

        const user = await models.user.create({
          username: args.username,
          password: password,
          isAdmin: args.isAdmin
        });

        const val = await models.client.create({
          nom: args.nom,
          prenom: args.prenom,
          refUser: user.id,
          tel: args.tel,
          ville: args.ville,
          pays: args.pays
        });
        return val;
      } catch (error) {
        console.log(error);
        return new Error("une erreur est survenue, veiller reessayer !");
      }
    },
    addCategorie: async (parent, args, { models, user }) => {
      try {
        // console.log(args.dateCreation + ' Z');
        if (!user) return new Error("vous devez vous authentifiez d'abord");
        const categorie = await models.categorie.findOne({
          where: {
            designation: args.designation
          }
        });

        if (categorie) return new Error("cette categorie existe déjà");
        const val = await models.categorie.create({
          designation: args.designation
        });
        dataLoader.categorieLoader.clearAll();
        return val;
      } catch (error) {
        console.log(error);
        return new Error("une erreur est survenue, veiller reessayer !");
      }
    },
    addCommande: async (parent, args, { models, user }) => {
      try {
        // console.log(args.dateCreation + ' Z');
        if (!user) return new Error("vous devez vous authentifiez d'abord");
        const produit = await models.produit.findOne({
          where: {
            id: args.produitId
          }
        });
        if (!(produit.quantite >= args.quantite))
          return new Error(
            "Desole la quantite disponible en stock est insuffisant"
          );

        await produit.update({
          quantite: produit.quantite - args.quantite
        });

        const val = await models.commande.create({
          client: args.clientId,
          produit: args.produitId,
          quantite: args.quantite
        });
        return val;
      } catch (error) {
        console.log(error);
        return new Error("une erreur est survenue, veiller reessayer !");
      }
    },
    addProduit: async (parent, args, { models, user, dataLoader }) => {
      try {
        // console.log(args.dateCreation + ' Z');
        if (!user) return new Error("vous devez vous authentifiez d'abord");
        const produit = await models.produit.findOne({
          where: {
            designation: args.designation
          }
        });

        if (produit) return new Error("cet produit existe déjà");
        const val = await models.produit.create({
          designation: args.designation,
          descriptions: args.descriptions,
          img: args.img,
          images: args.images,
          price: args.price,
          quantite: args.quantite,
          categorie: args.categorieId
        });
        dataLoader.produitLoader.clearAll();
        return val;
      } catch (error) {
        console.log(error);
        return new Error("une erreur est survenue, veiller reessayer !");
      }
    }
  }
};

module.exports = resolvers;
