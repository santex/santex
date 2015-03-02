pohTable = [{"altitude":2000,"temperature":11,"rpm":2100,"mp":19,"pctbhp":43,"ktas":112,"gph":6.7},
{"altitude":2000,"temperature":11,"rpm":2100,"mp":20,"pctbhp":46,"ktas":116,"gph":7.1},
{"altitude":2000,"temperature":11,"rpm":2100,"mp":21,"pctbhp":50,"ktas":119,"gph":7.5},
{"altitude":2000,"temperature":11,"rpm":2100,"mp":22,"pctbhp":53,"ktas":122,"gph":7.8},
{"altitude":2000,"temperature":11,"rpm":2100,"mp":23,"pctbhp":57,"ktas":125,"gph":8.3},
{"altitude":2000,"temperature":11,"rpm":2100,"mp":24,"pctbhp":60,"ktas":128,"gph":8.7},
{"altitude":2000,"temperature":11,"rpm":2100,"mp":25,"pctbhp":63,"ktas":131,"gph":9.1},
{"altitude":2000,"temperature":11,"rpm":2200,"mp":22,"pctbhp":56,"ktas":125,"gph":8.2},
{"altitude":2000,"temperature":11,"rpm":2200,"mp":23,"pctbhp":60,"ktas":128,"gph":8.7},
{"altitude":2000,"temperature":11,"rpm":2200,"mp":24,"pctbhp":63,"ktas":131,"gph":9.1},
{"altitude":2000,"temperature":11,"rpm":2200,"mp":25,"pctbhp":67,"ktas":134,"gph":9.6},
{"altitude":2000,"temperature":11,"rpm":2300,"mp":22,"pctbhp":60,"ktas":128,"gph":8.7},
{"altitude":2000,"temperature":11,"rpm":2300,"mp":23,"pctbhp":64,"ktas":132,"gph":9.2},
{"altitude":2000,"temperature":11,"rpm":2300,"mp":24,"pctbhp":67,"ktas":135,"gph":9.7},
{"altitude":2000,"temperature":11,"rpm":2300,"mp":25,"pctbhp":71,"ktas":138,"gph":10.2},
{"altitude":2000,"temperature":11,"rpm":2400,"mp":22,"pctbhp":63,"ktas":131,"gph":9.1},
{"altitude":2000,"temperature":11,"rpm":2400,"mp":23,"pctbhp":67,"ktas":134,"gph":9.6},
{"altitude":2000,"temperature":11,"rpm":2400,"mp":24,"pctbhp":71,"ktas":138,"gph":10.2},
{"altitude":2000,"temperature":11,"rpm":2400,"mp":25,"pctbhp":75,"ktas":141,"gph":10.7},
{"altitude":2000,"temperature":11,"rpm":2500,"mp":21,"pctbhp":62,"ktas":131,"gph":9},
{"altitude":2000,"temperature":11,"rpm":2500,"mp":22,"pctbhp":67,"ktas":134,"gph":9.6},
{"altitude":2000,"temperature":11,"rpm":2500,"mp":23,"pctbhp":71,"ktas":138,"gph":10.1},
{"altitude":2000,"temperature":11,"rpm":2500,"mp":24,"pctbhp":75,"ktas":141,"gph":10.7},
{"altitude":4000,"temperature":7,"rpm":2100,"mp":19,"pctbhp":45,"ktas":115,"gph":6.9},
{"altitude":4000,"temperature":7,"rpm":2100,"mp":20,"pctbhp":48,"ktas":120,"gph":7.3},
{"altitude":4000,"temperature":7,"rpm":2100,"mp":21,"pctbhp":51,"ktas":123,"gph":7.6},
{"altitude":4000,"temperature":7,"rpm":2100,"mp":22,"pctbhp":55,"ktas":126,"gph":8},
{"altitude":4000,"temperature":7,"rpm":2100,"mp":23,"pctbhp":58,"ktas":129,"gph":8.5},
{"altitude":4000,"temperature":7,"rpm":2100,"mp":24,"pctbhp":62,"ktas":132,"gph":8.9},
{"altitude":4000,"temperature":7,"rpm":2100,"mp":25,"pctbhp":65,"ktas":135,"gph":9.4},
{"altitude":4000,"temperature":7,"rpm":2200,"mp":22,"pctbhp":58,"ktas":129,"gph":8.5},
{"altitude":4000,"temperature":7,"rpm":2200,"mp":23,"pctbhp":62,"ktas":132,"gph":8.9},
{"altitude":4000,"temperature":7,"rpm":2200,"mp":24,"pctbhp":65,"ktas":135,"gph":9.3},
{"altitude":4000,"temperature":7,"rpm":2200,"mp":25,"pctbhp":69,"ktas":138,"gph":9.8},
{"altitude":4000,"temperature":7,"rpm":2300,"mp":22,"pctbhp":62,"ktas":132,"gph":8.9},
{"altitude":4000,"temperature":7,"rpm":2300,"mp":23,"pctbhp":65,"ktas":136,"gph":9.4},
{"altitude":4000,"temperature":7,"rpm":2300,"mp":24,"pctbhp":69,"ktas":139,"gph":9.9},
{"altitude":4000,"temperature":7,"rpm":2300,"mp":25,"pctbhp":73,"ktas":142,"gph":10.5},
{"altitude":4000,"temperature":7,"rpm":2400,"mp":22,"pctbhp":65,"ktas":135,"gph":9.3},
{"altitude":4000,"temperature":7,"rpm":2400,"mp":23,"pctbhp":69,"ktas":139,"gph":9.9},
{"altitude":4000,"temperature":7,"rpm":2400,"mp":24,"pctbhp":73,"ktas":142,"gph":10.5},
{"altitude":4000,"temperature":7,"rpm":2400,"mp":25,"pctbhp":77,"ktas":145,"gph":11.1},
{"altitude":4000,"temperature":7,"rpm":2500,"mp":21,"pctbhp":64,"ktas":135,"gph":9.3},
{"altitude":4000,"temperature":7,"rpm":2500,"mp":22,"pctbhp":69,"ktas":138,"gph":9.8},
{"altitude":4000,"temperature":7,"rpm":2500,"mp":23,"pctbhp":73,"ktas":142,"gph":10.4},
{"altitude":4000,"temperature":7,"rpm":2500,"mp":24,"pctbhp":77,"ktas":145,"gph":11},
{"altitude":6000,"temperature":3,"rpm":2100,"mp":18,"pctbhp":43,"ktas":114,"gph":6.7},
{"altitude":6000,"temperature":3,"rpm":2100,"mp":19,"pctbhp":46,"ktas":119,"gph":7},
{"altitude":6000,"temperature":3,"rpm":2100,"mp":20,"pctbhp":49,"ktas":123,"gph":7.4},
{"altitude":6000,"temperature":3,"rpm":2100,"mp":21,"pctbhp":53,"ktas":127,"gph":7.8},
{"altitude":6000,"temperature":3,"rpm":2100,"mp":22,"pctbhp":56,"ktas":130,"gph":8.2},
{"altitude":6000,"temperature":3,"rpm":2100,"mp":23,"pctbhp":60,"ktas":133,"gph":8.7},
{"altitude":6000,"temperature":3,"rpm":2100,"mp":24,"pctbhp":63,"ktas":136,"gph":9.1},
{"altitude":6000,"temperature":3,"rpm":2200,"mp":21,"pctbhp":56,"ktas":130,"gph":8.2},
{"altitude":6000,"temperature":3,"rpm":2200,"mp":22,"pctbhp":60,"ktas":133,"gph":8.7},
{"altitude":6000,"temperature":3,"rpm":2200,"mp":23,"pctbhp":63,"ktas":136,"gph":9.1},
{"altitude":6000,"temperature":3,"rpm":2200,"mp":24,"pctbhp":67,"ktas":139,"gph":9.6},
{"altitude":6000,"temperature":3,"rpm":2300,"mp":21,"pctbhp":59,"ktas":133,"gph":8.6},
{"altitude":6000,"temperature":3,"rpm":2300,"mp":22,"pctbhp":63,"ktas":136,"gph":9.1},
{"altitude":6000,"temperature":3,"rpm":2300,"mp":23,"pctbhp":67,"ktas":140,"gph":9.6},
{"altitude":6000,"temperature":3,"rpm":2300,"mp":24,"pctbhp":71,"ktas":143,"gph":10.2},
{"altitude":6000,"temperature":3,"rpm":2400,"mp":21,"pctbhp":63,"ktas":136,"gph":9.1},
{"altitude":6000,"temperature":3,"rpm":2400,"mp":22,"pctbhp":67,"ktas":139,"gph":9.6},
{"altitude":6000,"temperature":3,"rpm":2400,"mp":23,"pctbhp":71,"ktas":143,"gph":10.2},
{"altitude":6000,"temperature":3,"rpm":2400,"mp":24,"pctbhp":75,"ktas":146,"gph":10.8},
{"altitude":6000,"temperature":3,"rpm":2500,"mp":20,"pctbhp":62,"ktas":135,"gph":9},
{"altitude":6000,"temperature":3,"rpm":2500,"mp":21,"pctbhp":66,"ktas":139,"gph":9.5},
{"altitude":6000,"temperature":3,"rpm":2500,"mp":22,"pctbhp":71,"ktas":142,"gph":10.1},
{"altitude":6000,"temperature":3,"rpm":2500,"mp":23,"pctbhp":75,"ktas":146,"gph":10.7},
{"altitude":8000,"temperature":"-1","rpm":2100,"mp":18,"pctbhp":44,"ktas":118,"gph":6.8},
{"altitude":8000,"temperature":"-1","rpm":2100,"mp":19,"pctbhp":47,"ktas":123,"gph":7.2},
{"altitude":8000,"temperature":"-1","rpm":2100,"mp":20,"pctbhp":51,"ktas":127,"gph":7.6},
{"altitude":8000,"temperature":"-1","rpm":2100,"mp":21,"pctbhp":55,"ktas":130,"gph":8},
{"altitude":8000,"temperature":"-1","rpm":2100,"mp":22,"pctbhp":58,"ktas":134,"gph":8.4},
{"altitude":8000,"temperature":"-1","rpm":2200,"mp":19,"pctbhp":51,"ktas":127,"gph":7.6},
{"altitude":8000,"temperature":"-1","rpm":2200,"mp":20,"pctbhp":54,"ktas":130,"gph":8},
{"altitude":8000,"temperature":"-1","rpm":2200,"mp":21,"pctbhp":58,"ktas":134,"gph":8.4},
{"altitude":8000,"temperature":"-1","rpm":2200,"mp":22,"pctbhp":61,"ktas":137,"gph":8.9},
{"altitude":8000,"temperature":"-1","rpm":2300,"mp":19,"pctbhp":53,"ktas":129,"gph":7.9},
{"altitude":8000,"temperature":"-1","rpm":2300,"mp":20,"pctbhp":57,"ktas":133,"gph":8.3},
{"altitude":8000,"temperature":"-1","rpm":2300,"mp":21,"pctbhp":61,"ktas":137,"gph":8.8},
{"altitude":8000,"temperature":"-1","rpm":2300,"mp":22,"pctbhp":65,"ktas":140,"gph":9.3},
{"altitude":8000,"temperature":"-1","rpm":2400,"mp":19,"pctbhp":56,"ktas":132,"gph":8.2},
{"altitude":8000,"temperature":"-1","rpm":2400,"mp":20,"pctbhp":60,"ktas":136,"gph":8.8},
{"altitude":8000,"temperature":"-1","rpm":2400,"mp":21,"pctbhp":65,"ktas":140,"gph":9.3},
{"altitude":8000,"temperature":"-1","rpm":2400,"mp":22,"pctbhp":69,"ktas":144,"gph":9.9},
{"altitude":8000,"temperature":"-1","rpm":2500,"mp":19,"pctbhp":60,"ktas":135,"gph":8.7},
{"altitude":8000,"temperature":"-1","rpm":2500,"mp":20,"pctbhp":64,"ktas":139,"gph":9.2},
{"altitude":8000,"temperature":"-1","rpm":2500,"mp":21,"pctbhp":68,"ktas":143,"gph":9.8},
{"altitude":8000,"temperature":"-1","rpm":2500,"mp":22,"pctbhp":72,"ktas":147,"gph":10.4},
{"altitude":10000,"temperature":"-5","rpm":2100,"mp":18,"pctbhp":45,"ktas":122,"gph":7},
{"altitude":10000,"temperature":"-5","rpm":2100,"mp":19,"pctbhp":49,"ktas":126,"gph":7.4},
{"altitude":10000,"temperature":"-5","rpm":2100,"mp":20,"pctbhp":52,"ktas":131,"gph":7.7},
{"altitude":10000,"temperature":"-5","rpm":2200,"mp":17,"pctbhp":45,"ktas":121,"gph":6.9},
{"altitude":10000,"temperature":"-5","rpm":2200,"mp":18,"pctbhp":49,"ktas":126,"gph":7.3},
{"altitude":10000,"temperature":"-5","rpm":2200,"mp":19,"pctbhp":52,"ktas":131,"gph":7.7},
{"altitude":10000,"temperature":"-5","rpm":2200,"mp":20,"pctbhp":56,"ktas":134,"gph":8.2},
{"altitude":10000,"temperature":"-5","rpm":2300,"mp":17,"pctbhp":47,"ktas":124,"gph":7.2},
{"altitude":10000,"temperature":"-5","rpm":2300,"mp":18,"pctbhp":51,"ktas":129,"gph":7.6},
{"altitude":10000,"temperature":"-5","rpm":2300,"mp":19,"pctbhp":55,"ktas":133,"gph":8},
{"altitude":10000,"temperature":"-5","rpm":2300,"mp":20,"pctbhp":59,"ktas":137,"gph":8.5},
{"altitude":10000,"temperature":"-5","rpm":2400,"mp":17,"pctbhp":50,"ktas":127,"gph":7.4},
{"altitude":10000,"temperature":"-5","rpm":2400,"mp":18,"pctbhp":54,"ktas":132,"gph":7.9},
{"altitude":10000,"temperature":"-5","rpm":2400,"mp":19,"pctbhp":58,"ktas":136,"gph":8.4},
{"altitude":10000,"temperature":"-5","rpm":2400,"mp":20,"pctbhp":62,"ktas":140,"gph":9},
{"altitude":10000,"temperature":"-5","rpm":2500,"mp":17,"pctbhp":53,"ktas":132,"gph":7.8},
{"altitude":10000,"temperature":"-5","rpm":2500,"mp":18,"pctbhp":57,"ktas":136,"gph":8.4},
{"altitude":10000,"temperature":"-5","rpm":2500,"mp":19,"pctbhp":62,"ktas":140,"gph":8.9},
{"altitude":10000,"temperature":"-5","rpm":2500,"mp":20,"pctbhp":66,"ktas":144,"gph":9.5},
{"altitude":12000,"temperature":"-9","rpm":2100,"mp":17,"pctbhp":43,"ktas":119,"gph":6.7},
{"altitude":12000,"temperature":"-9","rpm":2100,"mp":18,"pctbhp":47,"ktas":125,"gph":7.1},
{"altitude":12000,"temperature":"-9","rpm":2200,"mp":17,"pctbhp":46,"ktas":125,"gph":7.1},
{"altitude":12000,"temperature":"-9","rpm":2200,"mp":18,"pctbhp":50,"ktas":130,"gph":7.5},
{"altitude":12000,"temperature":"-9","rpm":2300,"mp":16,"pctbhp":45,"ktas":122,"gph":6.9},
{"altitude":12000,"temperature":"-9","rpm":2300,"mp":17,"pctbhp":48,"ktas":128,"gph":7.3},
{"altitude":12000,"temperature":"-9","rpm":2300,"mp":18,"pctbhp":52,"ktas":133,"gph":7.7},
{"altitude":12000,"temperature":"-9","rpm":2400,"mp":16,"pctbhp":47,"ktas":126,"gph":7.1},
{"altitude":12000,"temperature":"-9","rpm":2400,"mp":17,"pctbhp":51,"ktas":132,"gph":7.6},
{"altitude":12000,"temperature":"-9","rpm":2400,"mp":18,"pctbhp":55,"ktas":136,"gph":8.1},
{"altitude":12000,"temperature":"-9","rpm":2500,"mp":15,"pctbhp":46,"ktas":124,"gph":7},
{"altitude":12000,"temperature":"-9","rpm":2500,"mp":16,"pctbhp":50,"ktas":130,"gph":7.5},
{"altitude":12000,"temperature":"-9","rpm":2500,"mp":17,"pctbhp":55,"ktas":136,"gph":8},
{"altitude":12000,"temperature":"-9","rpm":2500,"mp":18,"pctbhp":59,"ktas":140,"gph":8.6}];