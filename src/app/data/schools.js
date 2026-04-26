// Comprehensive list of US colleges and universities with their email domains
// This data can be expanded or loaded from an API in the future

export const SCHOOLS = [
  // Top Universities
  { name: "Harvard University", domain: "harvard.edu", type: "college" },
  { name: "Stanford University", domain: "stanford.edu", type: "college" },
  {
    name: "Massachusetts Institute of Technology",
    domain: "mit.edu",
    type: "college",
  },
  { name: "Yale University", domain: "yale.edu", type: "college" },
  { name: "Princeton University", domain: "princeton.edu", type: "college" },
  { name: "Columbia University", domain: "columbia.edu", type: "college" },
  { name: "University of Pennsylvania", domain: "upenn.edu", type: "college" },
  { name: "Duke University", domain: "duke.edu", type: "college" },
  {
    name: "Northwestern University",
    domain: "northwestern.edu",
    type: "college",
  },
  { name: "Dartmouth College", domain: "dartmouth.edu", type: "college" },
  { name: "Brown University", domain: "brown.edu", type: "college" },
  { name: "Cornell University", domain: "cornell.edu", type: "college" },
  { name: "University of Chicago", domain: "uchicago.edu", type: "college" },
  {
    name: "California Institute of Technology",
    domain: "caltech.edu",
    type: "college",
  },
  { name: "Johns Hopkins University", domain: "jhu.edu", type: "college" },

  // Wake Forest and NC Schools
  { name: "Wake Forest University", domain: "wfu.edu", type: "college" },
  { name: "Duke University", domain: "duke.edu", type: "college" },
  {
    name: "University of North Carolina at Chapel Hill",
    domain: "unc.edu",
    type: "college",
  },
  {
    name: "North Carolina State University",
    domain: "ncsu.edu",
    type: "college",
  },
  { name: "Davidson College", domain: "davidson.edu", type: "college" },
  { name: "Elon University", domain: "elon.edu", type: "college" },

  // UC System
  {
    name: "University of California, Berkeley",
    domain: "berkeley.edu",
    type: "college",
  },
  {
    name: "University of California, Los Angeles",
    domain: "ucla.edu",
    type: "college",
  },
  {
    name: "University of California, San Diego",
    domain: "ucsd.edu",
    type: "college",
  },
  {
    name: "University of California, Irvine",
    domain: "uci.edu",
    type: "college",
  },
  {
    name: "University of California, Davis",
    domain: "ucdavis.edu",
    type: "college",
  },
  {
    name: "University of California, Santa Barbara",
    domain: "ucsb.edu",
    type: "college",
  },

  // Big Ten
  { name: "University of Michigan", domain: "umich.edu", type: "college" },
  { name: "Ohio State University", domain: "osu.edu", type: "college" },
  { name: "Penn State University", domain: "psu.edu", type: "college" },
  {
    name: "University of Wisconsin-Madison",
    domain: "wisc.edu",
    type: "college",
  },
  {
    name: "University of Illinois Urbana-Champaign",
    domain: "illinois.edu",
    type: "college",
  },
  { name: "Purdue University", domain: "purdue.edu", type: "college" },
  { name: "University of Minnesota", domain: "umn.edu", type: "college" },
  { name: "Indiana University", domain: "indiana.edu", type: "college" },
  { name: "Michigan State University", domain: "msu.edu", type: "college" },
  { name: "University of Iowa", domain: "uiowa.edu", type: "college" },

  // ACC Schools
  { name: "University of Virginia", domain: "virginia.edu", type: "college" },
  {
    name: "Georgia Institute of Technology",
    domain: "gatech.edu",
    type: "college",
  },
  { name: "University of Miami", domain: "miami.edu", type: "college" },
  { name: "Boston College", domain: "bc.edu", type: "college" },
  { name: "Syracuse University", domain: "syracuse.edu", type: "college" },
  { name: "University of Pittsburgh", domain: "pitt.edu", type: "college" },
  { name: "Virginia Tech", domain: "vt.edu", type: "college" },
  { name: "Clemson University", domain: "clemson.edu", type: "college" },
  { name: "Florida State University", domain: "fsu.edu", type: "college" },

  // SEC Schools
  { name: "University of Florida", domain: "ufl.edu", type: "college" },
  { name: "University of Georgia", domain: "uga.edu", type: "college" },
  { name: "Vanderbilt University", domain: "vanderbilt.edu", type: "college" },
  { name: "University of Alabama", domain: "ua.edu", type: "college" },
  { name: "Auburn University", domain: "auburn.edu", type: "college" },
  { name: "Louisiana State University", domain: "lsu.edu", type: "college" },
  { name: "University of Tennessee", domain: "utk.edu", type: "college" },
  { name: "University of Kentucky", domain: "uky.edu", type: "college" },
  { name: "University of South Carolina", domain: "sc.edu", type: "college" },
  { name: "Texas A&M University", domain: "tamu.edu", type: "college" },

  // Texas Schools
  {
    name: "University of Texas at Austin",
    domain: "utexas.edu",
    type: "college",
  },
  { name: "Rice University", domain: "rice.edu", type: "college" },
  { name: "Southern Methodist University", domain: "smu.edu", type: "college" },
  { name: "Texas Christian University", domain: "tcu.edu", type: "college" },
  { name: "Baylor University", domain: "baylor.edu", type: "college" },

  // New York Schools
  { name: "New York University", domain: "nyu.edu", type: "college" },
  { name: "Fordham University", domain: "fordham.edu", type: "college" },
  { name: "University of Rochester", domain: "rochester.edu", type: "college" },
  {
    name: "Rensselaer Polytechnic Institute",
    domain: "rpi.edu",
    type: "college",
  },

  // Pennsylvania Schools
  { name: "Carnegie Mellon University", domain: "cmu.edu", type: "college" },
  { name: "Lehigh University", domain: "lehigh.edu", type: "college" },
  { name: "Villanova University", domain: "villanova.edu", type: "college" },

  // Other Notable Schools
  { name: "Emory University", domain: "emory.edu", type: "college" },
  { name: "University of Notre Dame", domain: "nd.edu", type: "college" },
  { name: "Georgetown University", domain: "georgetown.edu", type: "college" },
  {
    name: "University of Southern California",
    domain: "usc.edu",
    type: "college",
  },
  {
    name: "Washington University in St. Louis",
    domain: "wustl.edu",
    type: "college",
  },
  { name: "Tufts University", domain: "tufts.edu", type: "college" },
  { name: "Boston University", domain: "bu.edu", type: "college" },
  {
    name: "Northeastern University",
    domain: "northeastern.edu",
    type: "college",
  },
  {
    name: "Case Western Reserve University",
    domain: "case.edu",
    type: "college",
  },
  { name: "Tulane University", domain: "tulane.edu", type: "college" },
  { name: "University of Washington", domain: "uw.edu", type: "college" },
  {
    name: "University of Colorado Boulder",
    domain: "colorado.edu",
    type: "college",
  },
  { name: "Arizona State University", domain: "asu.edu", type: "college" },
  { name: "University of Arizona", domain: "arizona.edu", type: "college" },
  { name: "University of Oregon", domain: "uoregon.edu", type: "college" },
  {
    name: "Oregon State University",
    domain: "oregonstate.edu",
    type: "college",
  },
];

// Helper function to search schools
export function searchSchools(query) {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();
  return SCHOOLS.filter(
    (school) =>
      school.name.toLowerCase().includes(lowerQuery) ||
      school.domain.toLowerCase().includes(lowerQuery),
  ).slice(0, 10); // Limit to 10 results
}

// Helper function to get school by domain
export function getSchoolByDomain(domain) {
  return SCHOOLS.find((school) => school.domain === domain.toLowerCase());
}

// Helper function to get school by name
export function getSchoolByName(name) {
  return SCHOOLS.find(
    (school) => school.name.toLowerCase() === name.toLowerCase(),
  );
}
