import UssdSession from "../models/UssdSession.js";
import FishStock from "../models/FishStock.js";
import BuyerBooking from "../models/BuyerBooking.js";
import ColdTransport from "../models/ColdTransport.js";
import FeedPrice from "../models/FeedPrice.js";
import FarmingTip from "../models/FarmingTip.js";

export const handleUSSD = async (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  const parts = text.split("*");
  let response = "";

  // Retrieve or create session
  let session = await UssdSession.findOne({ sessionId });
  if (!session) {
    session = await UssdSession.create({
      sessionId,
      phoneNumber,
      serviceCode,
      step: 0,
      actionType: "none",
    });
  }

  // MAIN MENU
  if (text === "") {
    response = `CON Welcome to SamakiLink
1. Record Fish Stock
2. Check Feed Price
3. Book Buyer
4. Request Cold Transport
5. Get Farming Tips`;
  }

  // RECORD FISH STOCK
  else if (parts[0] === "1") {
    session.actionType = "record_stock";

    if (parts.length === 1) {
      response = `CON Enter pond name or ID:`;
    } else if (parts.length === 2) {
      response = `CON Enter number of fish stocked in ${parts[1]}:`;
    } else if (parts.length === 3) {
      response = `CON Enter average weight per fish (in grams):`;
    } else if (parts.length === 4) {
      const pond = parts[1];
      const number = parseInt(parts[2]);
      const weight = parseFloat(parts[3]);

      if (isNaN(number) || isNaN(weight)) {
        response = `END Invalid entry. Please try again.`;
      } else {
        // Save to DB
        await FishStock.create({
          phoneNumber,
          pondName: pond,
          numberOfFish: number,
          averageWeight: weight,
        });
        response = `END Recorded ${number} fish (${weight}g avg) in pond ${pond}.`;
      }
    }
  }

  //  CHECK FEED PRICE
  else if (parts[0] === "2") {
    session.actionType = "check_feed_price";

    if (parts.length === 1) {
      response = `CON Select Feed Type:
1. Starter Feed
2. Grower Feed
3. Finisher Feed`;
    } else if (parts.length === 2) {
      const feedType = parts[1];
      let feedName = "";
      let price = null;

      if (feedType === "1") feedName = "Starter";
      else if (feedType === "2") feedName = "Grower";
      else if (feedType === "3") feedName = "Finisher";

      if (feedName) {
        // Fetch from DB or use default
        const feed = await FeedPrice.findOne({ feedType: feedName });
        price = feed ? feed.pricePerKg : feedType === "1" ? 120 : feedType === "2" ? 100 : 90;
        response = `END  ${feedName} Feed price: KES ${price}/kg.`;
      } else {
        response = `END Invalid selection.`;
      }
    }
  }

  // BOOK BUYER
  else if (parts[0] === "3") {
    session.actionType = "book_buyer";

    if (parts.length === 1) {
      response = `CON Enter quantity (kg) available for sale:`;
    } else if (parts.length === 2) {
      response = `CON Enter your location:`;
    } else if (parts.length === 3) {
      const quantity = parseFloat(parts[1]);
      const location = parts[2];

      if (isNaN(quantity)) {
        response = `END Invalid quantity.`;
      } else {
        await BuyerBooking.create({
          phoneNumber,
          quantityKg: quantity,
          location,
        });
        response = `END 🐟 Buyer booking received for ${quantity}kg at ${location}. You’ll be contacted shortly.`;
      }
    }
  }

  // REQUEST COLD TRANSPORT
  else if (parts[0] === "4") {
    session.actionType = "cold_transport";

    if (parts.length === 1) {
      response = `CON Enter pickup location:`;
    } else if (parts.length === 2) {
      response = `CON Enter destination:`;
    } else if (parts.length === 3) {
      response = `CON Enter weight (kg) of fish to transport:`;
    } else if (parts.length === 4) {
      const pickup = parts[1];
      const destination = parts[2];
      const weight = parseFloat(parts[3]);

      if (isNaN(weight)) {
        response = `END Invalid weight.`;
      } else {
        await ColdTransport.create({
          phoneNumber,
          pickup,
          destination,
          weightKg: weight,
        });
        response = `END Cold transport booked from ${pickup} to ${destination} for ${weight}kg.`;
      }
    }
  }

  // GET FARMING TIPS
  else if (parts[0] === "5") {
    session.actionType = "farming_tips";

    if (parts.length === 1) {
      response = `CON Select Category:
1. Feeding
2. Disease Control
3. Water Management
4. Breeding`;
    } else if (parts.length === 2) {
      const choice = parts[1];
      let category = "";

      switch (choice) {
        case "1":
          category = "Feeding";
          break;
        case "2":
          category = "Disease Control";
          break;
        case "3":
          category = "Water Management";
          break;
        case "4":
          category = "Breeding";
          break;
      }

      if (category) {
        // Get from DB or fallback tip
        const tipData = await FarmingTip.findOne({ category });
        const tip =
          tipData?.message ||
          {
            Feeding: "Feed 3 times daily and avoid overfeeding. Keep a regular schedule.",
            "Disease Control": "Quarantine new fish and observe for fungus or fin rot regularly.",
            "Water Management": "Maintain 25°C–30°C and pH between 6.5–8.0 for healthy fish.",
            Breeding: "Select healthy breeders and provide calm conditions for spawning.",
          }[category];

        response = `END  Tip: ${tip}`;
      } else {
        response = `END Invalid option.`;
      }
    }
  }

  // INVALID OPTION
  else {
    response = `END Invalid input. Please try again.`;
  }

  //  Save progress
  session.step = parts.length;
  session.tempData = { text };
  await session.save();

  // Send back USSD text response
  res.set("Content-Type", "text/plain");
  res.send(response);
};
