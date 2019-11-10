const LoadHash = require("lodash");

const batchsLoads = {
  batchProduit: async (keys, { produit }) => {
    const produits = await produit.findAll({
      raw: true,
      where: {
        categorie: keys
      }
    });
    const gc = LoadHash.groupBy(produits, "categorie");

    return keys.map(k => gc[k] || []);
  },
  batchTotal: async (keys, { commande }) => {
    const p = await commande.count({
      attributes:["id"],
      raw: true,
      where: {
        etat: keys
      },
      group:["id"]
    });
    console.log(p);
    const gc = LoadHash.groupBy(p, "id");

    return keys.map(k => gc[k] || []);
  },
  batchPrice: async (keys, { produit }) => {
    const p = await produit.findAll({
      raw: true,
      where: {
        id: keys
      }
    });

    const gc = LoadHash.groupBy(p, "id");
    console.log(keys.map(k => gc[k] || []));
    return keys.map(k => gc[k] || []);
  },
  batchTotalWithUserKey: async (keys, { commande }) => {
    const p = await commande.count({
      raw: true,
      where: {
        etat: 1,
        client: keys
      },
      group: ["id"]
    });
    return p;
  },
  batchCommande: async (keys, { commande }) => {
    const commandes = await commande.findAll({
      raw: true,
      where: {
        id: keys
      }
    });
    // const gc = LoadHash.groupBy(comandes, "id");

    // return keys.map(k => gc[k] || []);
    return commandes;
  },
  batchCategorie: async (keys, { categorie }) => {
    const categories = await categorie.findAll({
      raw: true,
      where: {
        id: keys
      }
    });
    return categories;
  }
};

module.exports = batchsLoads;
