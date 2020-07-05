const dhive = require("@hiveio/dhive");
const _ = require("lodash");

const config = require("./config.json");

let client = new dhive.Client([
  "https://api.hive.blog",
  "https://api.hivekings.com",
  "https://anyx.io",
  "https://api.openhive.network",
]);

let keyTop20 = dhive.PrivateKey.fromString(config.badgeWitnessTop20PostingKey);
let keyTop100 = dhive.PrivateKey.fromString(
  config.badgeWitnessTop100PostingKey
);

// Helper to avoid 5 transaction per block limit
const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

const getTop20Witnesses = async () => {
  let witnesses = await client.database.call("get_witnesses_by_vote", ["", 20]);
  return witnesses;
};

const getTop20Follower = async () => {
  let follower = await client.call("follow_api", "get_following", [
    config.badgeWitnessTop20,
    "",
    "blog",
    100,
  ]);
  return follower;
};

const getTop100Witnesses = async () => {
  let witnesses = await client.database.call("get_witnesses_by_vote", [
    "",
    100,
  ]);
  return witnesses;
};

const getTop100Follower = async () => {
  let follower = await client.call("follow_api", "get_following", [
    config.badgeWitnessTop100,
    "",
    "blog",
    100,
  ]);
  return follower;
};

const handleTop20Badge = async () => {
  try {
    let witnesses = await getTop20Witnesses();
    let follower = await getTop20Follower();

    witnesses.forEach((element) => {
      if (!_.find(follower, { following: element.owner })) {
        console.log(`TOP20: Account ${element.owner} not on follow: Add`);

        let jsonData = [
          "follow",
          {
            follower: config.badgeWitnessTop20,
            following: element.owner,
            what: ["blog"],
          },
        ];

        if (!config.debug) {
          _.delay(() => {
            client.broadcast.json(
              {
                required_auths: [],
                required_posting_auths: [config.badgeWitnessTop20],
                id: "follow",
                json: JSON.stringify(jsonData),
              },
              keyTop20
            );
          }, getRandomArbitrary(0, 600000));
        }
      }
    });

    follower.forEach((element) => {
      if (!_.find(witnesses, { owner: element.following })) {
        console.log(
          `TOP20: Account ${element.following} still on follow: Remove`
        );

        let jsonData = [
          "follow",
          {
            follower: config.badgeWitnessTop20,
            following: element.following,
            what: [],
          },
        ];

        if (!config.debug) {
          _.delay(() => {
            client.broadcast.json(
              {
                required_auths: [],
                required_posting_auths: [config.badgeWitnessTop20],
                id: "follow",
                json: JSON.stringify(jsonData),
              },
              keyTop20
            );
          }, getRandomArbitrary(0, 600000));
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const handleTop100Badge = async () => {
  try {
    let witnesses = await getTop100Witnesses();
    let follower = await getTop100Follower();

    witnesses.forEach((element) => {
      if (!_.find(follower, { following: element.owner })) {
        console.log(`TOP100: Account ${element.owner} not on follow: Add`);

        let jsonData = [
          "follow",
          {
            follower: config.badgeWitnessTop100,
            following: element.owner,
            what: ["blog"],
          },
        ];

        if (!config.debug) {
          _.delay(() => {
            client.broadcast.json(
              {
                required_auths: [],
                required_posting_auths: [config.badgeWitnessTop100],
                id: "follow",
                json: JSON.stringify(jsonData),
              },
              keyTop100
            );
          }, getRandomArbitrary(0, 600000));
        }
      }
    });

    follower.forEach((element) => {
      if (!_.find(witnesses, { owner: element.following })) {
        console.log(
          `TOP100: Account ${element.following} still on follow: Remove`
        );

        let jsonData = [
          "follow",
          {
            follower: config.badgeWitnessTop100,
            following: element.following,
            what: [],
          },
        ];

        if (!config.debug) {
          _.delay(() => {
            client.broadcast.json(
              {
                required_auths: [],
                required_posting_auths: [config.badgeWitnessTop100],
                id: "follow",
                json: JSON.stringify(jsonData),
              },
              keyTop100
            );
          }, getRandomArbitrary(0, 600000));
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// Run at Start
handleTop20Badge();
handleTop100Badge();

// Run every Hour
setInterval(handleTop20Badge, 3600000);
setInterval(handleTop100Badge, 3600000);
