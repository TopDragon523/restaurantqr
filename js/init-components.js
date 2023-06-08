var textComponents = [
  {
    type: "text",
    label: "Heading 1",
    style: {
      fontSize: 32,
      fontFamily: `'Courier New', Courier, monospace`,
      color: "black",
    },
  },
  {
    type: "text",
    label: "Heading 2",
    style: {
      fontSize: 32,
      fontFamily: `'Montserrat', sans-serif`,
      color: "black",
    },
  },
  {
    type: "text",
    label: "Heading 3",
    style: {
      fontSize: 32,
      fontFamily: `'Roboto', sans-serif`,
      color: "black",
    },
  },
  {
    type: "text",
    label: "Heading 4",
    style: {
      fontSize: 32,
      fontFamily: `'Readex Pro', sans-serif`,
      color: "black",
    },
  },
];

var backgroundImages = [
  "https://images.unsplash.com/photo-1604079628040-94301bb21b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfHNlYXJjaHwyfHxncmFkaWVudHxlbnwwfHx8fDE2ODU4MTUwOTR8MA&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1604076850742-4c7221f3101b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfHNlYXJjaHw0fHxncmFkaWVudHxlbnwwfHx8fDE2ODU4MTUwOTR8MA&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1569982175971-d92b01cf8694?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfHNlYXJjaHw3fHxncmFkaWVudHxlbnwwfHx8fDE2ODU4MTUwOTR8MA&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1579546928937-641f7ac9bced?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfHNlYXJjaHw5fHxncmFkaWVudHxlbnwwfHx8fDE2ODU4MTUwOTR8MA&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1557683316-973673baf926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfHNlYXJjaHw4fHxncmFkaWVudHxlbnwwfHx8fDE2ODU4MTUwOTR8MA&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1685527645763-2cd1b47a2cd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwzN3x8fHx8fDJ8fDE2ODU4OTYyODh8&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1685342412806-c7f4c4fa9215?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw0OXx8fHx8fDJ8fDE2ODU4OTQ3MTB8&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1685168641039-712c1eb2ff23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw2OXx8fHx8fDJ8fDE2ODU5MDE2Mjl8&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1661956602116-aa6865609028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MXwxfGFsbHw3MXx8fHx8fDJ8fDE2ODU5MDE2Mjl8&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1685633224810-bd23d2b0c699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw3NHx8fHx8fDJ8fDE2ODU5MDE2Mjl8&ixlib=rb-4.0.3&q=80&w=400",
];

var photos = [
  "https://images.unsplash.com/photo-1682685797898-6d7587974771?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MXwxfGFsbHwxfHx8fHx8Mnx8MTY4NTkwMzQ5MXw&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1609251520181-a914221b52b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwzfHx8fHx8Mnx8MTY4NTkwMzQ5MXw&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1685728399140-5650bbcfc015?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwyfHx8fHx8Mnx8MTY4NTkwMzQ5MXw&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1685703206366-d514f27076ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw0fHx8fHx8Mnx8MTY4NTkwMzQ5MXw&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1661956602153-23384936a1d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MXwxfGFsbHw2fHx8fHx8Mnx8MTY4NTkwMzQ5MXw&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1685665535340-c3b6d390a15f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw1fHx8fHx8Mnx8MTY4NTkwMzQ5MXw&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1685342412266-ef618801f189?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw3fHx8fHx8Mnx8MTY4NTkwMzQ5MXw&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1685295401439-c73adeb4d93c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNHx8fHx8fDJ8fDE2ODU5MDM0OTF8&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1682687982502-1529b3b33f85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MXwxfGFsbHwxNnx8fHx8fDJ8fDE2ODU5MDM0OTF8&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1685856471902-5854dbb3530d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwyNHx8fHx8fDJ8fDE2ODU4OTYyODh8&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1685703206477-aa1df00a1f0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwzMnx8fHx8fDJ8fDE2ODU4OTYyODh8&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1685648841642-bf3f88b7c60e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw1M3x8fHx8fDJ8fDE2ODU4OTQ3MTB8&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1685656307855-a09a5c8504d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw1N3x8fHx8fDJ8fDE2ODU4OTQ3MTB8&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1685630248371-9d42fd97f52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw2MHx8fHx8fDJ8fDE2ODU4OTQ3MTB8&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1685696964100-e2b47bd6d7d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw2NHx8fHx8fDJ8fDE2ODU5MDE2Mjl8&ixlib=rb-4.0.3&q=80&w=400",
];
