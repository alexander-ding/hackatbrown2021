const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { client } = require("../utils/twilio");

const db = admin.firestore();

exports.onUpdate = functions.firestore.document("events/{eventID}").onUpdate(async (snap, context) => {
  const eventID = context.params.eventID;
  // event pops!
  if (snap.after.data().people.length >= snap.after.data().numPeople) {
    const data = snap.after.data();
    const peoplePromises = data.people.map(person => db.collection("users").doc(person).get().then(res => res.data()));
    const people = await Promise.all(peoplePromises);
    for (person of people) {
      console.log({
        body: `The event "${data.message}" has just reached its party size ${data.numPeople} and is ready to go! Your group mates are:\n` + (
          // eslint-disable-next-line
          people.filter(p => p.phone !== person.phone).map(p => `${person.displayName} (${person.phone})`)
        ),
        from: "+17028304723",
        to: person.phone,
      })
      client.messages.create({
        body: `The event "${data.message}" has just reached its party size ${data.numPeople} and is ready to go! Your group mates are:\n` + (
          // eslint-disable-next-line
          people.filter(p => p.phone !== person.phone).map(p => `${person.displayName} (${person.phone})`)
        ).join("\n"),
        from: "+17028304723",
        to: person.phone,
      }).then(message => message).catch();
    }
    await db.collection("events").doc(eventID).delete();  
  } else if (snap.after.data().people.length === 0) {
    await db.collection("events").doc(eventID).delete();
  }
})