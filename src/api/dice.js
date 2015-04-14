/*
- 1 1d2 1d3 1d4 1d6 1d8 2d6 3d6 4d6 6d6 8d6 12d6 ...
... 1d8 1d10 2d6 ...
... 2d6 2d8 3d8 4d8 6d8 8d8 12d8 ...
... 1d10 1d12 3d6 ...
... 1d6 2d4 2d6 ...
... 2d8 2d10 4d8 ...
... 2d10 2d12 6d6 ...

  T     S    M   L   H    G    C
  -     1   1d2 1d3 1d4  1d6  1d8
  1    1d2  1d3 1d4 1d6  1d8  2d6
 1d2   1d3  1d4 1d6 1d8  2d6  3d6
 1d3   1d4  1d6 1d8 2d6  3d6  4d6
 1d4   1d6  1d8 2d6 3d6  4d6  6d6
 1d6   1d8 1d10 2d8 3d8  4d8  6d8
 1d8  1d10 1d12 3d6 4d6  6d6  8d6
 1d4   1d6  2d4 2d6 3d6  4d6  6d6
 1d8  1d10  2d6 3d6 4d6  6d6  8d6
1d10   2d6  2d8 3d8 4d8  6d8  8d8
 2d6   2d8 2d10 4d8 6d8  8d8 12d8
 2d8  2d10 2d12 6d6 8d6 12d6 16d6
*/

die_transitions = {
	"-": ["-", "1"],
	"1": ["-", "1d2"],
	"1d2": ["1", "1d3"],
	"1d3": ["1d2", "1d4"],
	"1d4": ["1d3", "1d6"],
	"1d6": ["1d4", "1d8"],
	"1d8": ["1d6", "2d6"],
	"1d10": ["1d8", "2d8"],
	"1d12": ["1d10", "3d6"],

	"2d4": ["1d6", "2d6"],
	"2d6": ["1d8", "3d6"],
	"2d8": ["2d6", "3d8"],
	"2d10": ["2d8", "4d8"],
	"2d12": ["2d10", "6d6"],

	"3d6": ["2d6", "4d6"],
	"3d8": ["2d8", "4d8"],

	"4d6": ["3d6", "6d6"],
	"4d8": ["3d8", "6d8"],

	"6d6": ["4d6", "8d6"],
	"6d8": ["4d8", "8d8"],

	"8d6": ["6d6", "12d6"],
	"8d8": ["6d8", "12d8"],
}

module.exports.transitionDie = function(die, transition) {
	var new_die = die;
	if(transition >= 0) {
		for(i = 0; i < transition; i++) {
			new_die = die_transitions[new_die][1];
		}
	} else {
		for(i = 0; i > transition; i--) {
			new_die = die_transitions[new_die][0];
		}
	}
	return new_die;
}

