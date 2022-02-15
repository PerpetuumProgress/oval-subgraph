/* eslint-disable no-unused-vars */
var fs = require('fs')
var addresses = require('@oceanprotocol/contracts/addresses/address.json')

async function replaceContractAddresses() {
  // load addresses file first
  if (process.env.ADDRESS_FILE) {
    console.log('Using custom ADDRESS_FILE instead of ocean-contracts npm dep')
    addresses = JSON.parse(fs.readFileSync(process.env.ADDRESS_FILE, 'utf8'))
  }
  console.log(process.argv)
  for (const network in addresses) {
    if (process.argv[2] && process.argv[2] != network) {
      console.log('Skipping ' + network)
      continue
    }
    console.log('Creating subgraph.' + network + '.yaml')
    let subgraph = fs.readFileSync('./scripts/subgraph.yaml', 'utf8')

    subgraph = subgraph.replace(/__NETWORK__/g, network)
    subgraph = subgraph.replace(
      /__STARTBLOCK__/g,
      addresses[network].startBlock
    )
    subgraph = subgraph.replace(
      /__ERC721FACTORYADDRESS__/g,
      "'" + addresses[network].ERC721Factory + "'"
    )
    subgraph = subgraph.replace(
      /__FIXEDRATEEXCHANGEADDRESS__/g,
      "'" + addresses[network].FixedPrice + "'"
    )
    subgraph = subgraph.replace(
      /__DISPENSERADDRESS__/g,
      "'" + addresses[network].FixedPrice + "'"
    )
    subgraph = subgraph.replace(
      /__FACTORYROUTERADDRESS__/g,
      "'" + addresses[network].Router + "'"
    )
    if (network != 'development')
      fs.writeFileSync('subgraph.' + network + '.yaml', subgraph, 'utf8')
    else fs.writeFileSync('subgraph.yaml', subgraph, 'utf8')
  }
}

replaceContractAddresses()