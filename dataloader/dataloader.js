const DataLoader = require("dataloader");
const bacthLoader = require("./batchLoad");
const models = require("../models");
const loaders = {
  produitLoader: new DataLoader(keys => bacthLoader.batchProduit(keys, models)),
  commandeLoader: new DataLoader(keys =>
    bacthLoader.batchCommande(keys, models)
  ),
  categorieLoader: new DataLoader(keys =>
    bacthLoader.batchCategorie(keys, models)
  ),
  totalLoader: new DataLoader(keys => bacthLoader.batchTotal(keys, models)),
  totalLoaderWithUserId: new DataLoader(keys =>
    bacthLoader.batchTotalWithUserKey(keys, models)
  ),
  priceLoader: new DataLoader(keys => bacthLoader.batchPrice(keys, models))
};

module.exports = loaders;
