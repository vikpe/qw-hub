export const regions = [
  {
    name: "Europe",
    country_codes: [
      "AD",
      "AL",
      "AM",
      "AT",
      "AX",
      "AZ",
      "BA",
      "BE",
      "BG",
      "BY",
      "CH",
      "CY",
      "CZ",
      "DE",
      "DK",
      "EE",
      "ES",
      "FI",
      "FO",
      "FR",
      "GB",
      "GE",
      "GG",
      "GI",
      "GR",
      "HR",
      "HU",
      "IE",
      "IM",
      "IS",
      "IT",
      "JE",
      "KZ",
      "LI",
      "LT",
      "LU",
      "LV",
      "MC",
      "MD",
      "ME",
      "MK",
      "MT",
      "NL",
      "NO",
      "PL",
      "PT",
      "RO",
      "RS",
      "RU",
      "SE",
      "SI",
      "SJ",
      "SK",
      "SM",
      "TR",
      "UA",
      "VA",
    ],
  },
  {
    name: "North America",
    country_codes: [
      "AG",
      "AI",
      "AN",
      "AW",
      "BB",
      "BL",
      "BM",
      "BQ",
      "BS",
      "BZ",
      "CA",
      "CR",
      "CU",
      "CW",
      "DM",
      "DO",
      "GD",
      "GL",
      "GP",
      "GT",
      "HN",
      "HT",
      "JM",
      "KN",
      "KY",
      "LC",
      "MF",
      "MQ",
      "MS",
      "MX",
      "NI",
      "PA",
      "PM",
      "PR",
      "SV",
      "SX",
      "TC",
      "TT",
      "UM",
      "US",
      "VC",
      "VG",
      "VI",
    ],
  },
  {
    name: "South America",
    country_codes: [
      "AR",
      "BO",
      "BR",
      "CL",
      "CO",
      "EC",
      "FK",
      "GF",
      "GY",
      "PY",
      "PE",
      "SR",
      "UY",
      "VE",
    ],
  },
  {
    name: "Oceania",
    country_codes: [
      "AS",
      "AU",
      "CK",
      "FJ",
      "FM",
      "GU",
      "KI",
      "MH",
      "MP",
      "NC",
      "NF",
      "NR",
      "NU",
      "NZ",
      "PF",
      "PG",
      "PN",
      "PW",
      "SB",
      "TK",
      "TO",
      "TV",
      "UM",
      "VU",
      "WF",
      "WS",
      "XX",
    ],
  },
  {
    name: "Asia",
    country_codes: [
      "AF",
      "AZ",
      "BH",
      "BD",
      "AM",
      "BT",
      "IO",
      "BN",
      "MM",
      "KH",
      "LK",
      "CN",
      "TW",
      "CX",
      "CC",
      "CY",
      "GE",
      "PS",
      "HK",
      "IN",
      "ID",
      "IR",
      "IQ",
      "IL",
      "JP",
      "KZ",
      "JO",
      "KP",
      "KR",
      "KW",
      "KG",
      "LA",
      "LB",
      "MO",
      "MY",
      "MV",
      "MN",
      "OM",
      "NP",
      "PK",
      "PH",
      "TL",
      "QA",
      "RU",
      "SA",
      "SG",
      "VN",
      "SY",
      "TJ",
      "TH",
      "AE",
      "TR",
      "TM",
      "UZ",
      "YE",
      "XE",
      "XD",
      "XS",
    ],
  },
  {
    name: "Undefined",
    country_codes: [],
  },
];

export const regionNameByCountryCode = (cc) => {
  for (let i = 0; i < regions.length; i++) {
    if (regions[i].country_codes.includes(cc)) {
      return regions[i].name;
    }
  }

  return "Undefined";
};
