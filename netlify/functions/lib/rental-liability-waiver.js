"use strict";

/**
 * Equipment rental liability waiver — versioned for click-wrap acceptance records.
 * Update WAIVER_VERSION whenever the text below changes.
 */

const WAIVER_VERSION = "2026-06-10";

const WAIVER_TITLE = "Equipment Rental Release, Waiver, and Assumption of Risk";

const WAIVER_SECTIONS = [
  {
    heading: "1. Parties and agreement",
    paragraphs: [
      'This Equipment Rental Release, Waiver, and Assumption of Risk ("Agreement") is entered into between Lakewood Reserve ("Lessor," "we," "us," or "our"), operator of guest accommodations near Raystown Lake, Huntingdon County, Pennsylvania, and the individual completing this rental checkout ("Renter," "you," or "your"). By checking the acceptance box and proceeding to payment, you agree to this Agreement on behalf of yourself and, if applicable, all minors or other persons for whom you are renting or who will use the equipment under your supervision.',
      "This Agreement governs your rental and use of kayaks, paddle boards, life jackets, paddles, and related accessories (collectively, the \"Equipment\") from our on-site storage area during your stay at Lakewood Reserve.",
    ],
  },
  {
    heading: "2. Eligibility and supervision",
    paragraphs: [
      "You represent that you are at least eighteen (18) years of age and legally competent to enter this Agreement, or that you are the parent or legal guardian of any minor who will use the Equipment and you accept this Agreement on their behalf.",
      "You agree to supervise all minors and guests using the Equipment and to ensure that every person using the Equipment can swim, understands basic water safety, and uses the Equipment only in a manner appropriate to their skill level.",
      "You are responsible for verifying that the quantity of life jackets and safety gear taken matches the number of users and that each user wears a properly fitted U.S. Coast Guard–approved personal flotation device (PFD) while on the water, as required by Pennsylvania law and our rules.",
    ],
  },
  {
    heading: "3. Acknowledgment of inherent risks",
    paragraphs: [
      "You understand that use of the Equipment on or near open water involves inherent and serious risks that cannot be eliminated, including but not limited to: capsizing or falling into the water; drowning or near-drowning; hypothermia; collision with other vessels, swimmers, docks, or fixed objects; contact with underwater hazards; equipment failure; changing weather, wind, waves, and currents; fatigue; and injury during launch, transport, or return of Equipment.",
      "You voluntarily choose to rent and use the Equipment with full knowledge of these risks. You assume full responsibility for all risks of injury, death, property damage, and other loss arising from your use of the Equipment, whether caused by ordinary negligence of Lakewood Reserve or otherwise, to the fullest extent permitted by Pennsylvania law.",
    ],
  },
  {
    heading: "4. Release and waiver of claims",
    paragraphs: [
      "To the maximum extent permitted by applicable law, you hereby release, waive, discharge, and covenant not to sue Lakewood Reserve, its owners, operators, employees, agents, contractors, and insurers (collectively, the \"Released Parties\") from any and all claims, demands, causes of action, damages, losses, or expenses (including attorneys' fees) arising out of or related to your rental, possession, or use of the Equipment, including claims arising from the ordinary negligence of the Released Parties.",
      "This release does not apply to claims that cannot be waived under Pennsylvania law, including liability for intentional misconduct or gross negligence where such limitation is prohibited.",
    ],
  },
  {
    heading: "5. Indemnification",
    paragraphs: [
      "You agree to defend, indemnify, and hold harmless the Released Parties from and against any claim, liability, damage, loss, or expense (including reasonable attorneys' fees) arising from your use of the Equipment, your breach of this Agreement, or injury to any person or property caused by you or anyone under your supervision while using the Equipment.",
    ],
  },
  {
    heading: "6. Equipment rules and renter duties",
    paragraphs: [
      "You agree to: (a) use the Equipment only on Raystown Lake or other areas we authorize; (b) not operate the Equipment while under the influence of alcohol, drugs, or any impairing substance; (c) not exceed the rated capacity of any vessel; (d) not use the Equipment after dark unless expressly permitted; (e) return all Equipment clean, dry where possible, and in the same condition as received, normal wear excepted; (f) securely lock the storage area after each use using the access code provided; (g) immediately notify us of any damage, loss, theft, or safety incident; and (h) cease use and return the Equipment if conditions become unsafe.",
      "You are financially responsible for repair or replacement costs for lost, stolen, or damaged Equipment caused by your misuse, negligence, or failure to secure the Equipment, at our then-current commercial replacement value.",
    ],
  },
  {
    heading: "7. No warranties",
    paragraphs: [
      "Equipment is rented \"as is\" without warranty of any kind, express or implied, including warranties of merchantability or fitness for a particular purpose. We do not guarantee that the Equipment is free from defect or that your use will be uninterrupted or safe.",
    ],
  },
  {
    heading: "8. Rental period and access",
    paragraphs: [
      "Your rental period is the duration selected at checkout. Access to the Equipment is provided via a one-time shed code sent by text message after verified payment. The code must not be shared with non-guests or persons not covered by this Agreement. Unauthorized access may result in additional charges and termination of rental privileges.",
    ],
  },
  {
    heading: "9. Governing law and dispute resolution",
    paragraphs: [
      "This Agreement is governed by the laws of the Commonwealth of Pennsylvania, without regard to conflict-of-law principles. Any dispute arising under this Agreement shall be brought exclusively in the state or federal courts located in Huntingdon County, Pennsylvania, and you consent to personal jurisdiction in those courts.",
    ],
  },
  {
    heading: "10. Severability and entire agreement",
    paragraphs: [
      "If any provision of this Agreement is held invalid or unenforceable, the remaining provisions remain in full force and effect. This Agreement constitutes the entire agreement regarding Equipment rental and supersedes prior oral or written understandings on this subject.",
    ],
  },
  {
    heading: "11. Electronic acceptance",
    paragraphs: [
      "You acknowledge that you have read this Agreement in full, understand its terms, and intend your electronic acceptance at checkout to serve as your legal signature. Your acceptance is recorded with the waiver version shown at checkout and stored with your payment transaction.",
    ],
  },
];

const ACCEPTANCE_LABEL =
  "I have read and agree to the Equipment Rental Release, Waiver, and Assumption of Risk. I understand that I am giving up substantial legal rights, including the right to sue for injuries resulting from ordinary negligence, to the extent permitted by law. I agree on my own behalf and on behalf of any minors or users under my supervision.";

function getPublicWaiver() {
  return {
    version: WAIVER_VERSION,
    title: WAIVER_TITLE,
    sections: WAIVER_SECTIONS,
    acceptanceLabel: ACCEPTANCE_LABEL,
  };
}

function isValidWaiverAcceptance(payload) {
  if (!payload || typeof payload !== "object") return false;
  if (payload.liabilityAccepted !== true) return false;
  return String(payload.liabilityVersion || "").trim() === WAIVER_VERSION;
}

module.exports = {
  WAIVER_VERSION,
  WAIVER_TITLE,
  ACCEPTANCE_LABEL,
  getPublicWaiver,
  isValidWaiverAcceptance,
};
