// import React, { useEffect, useState, useMemo } from 'react';
import React, { useMemo } from 'react';
import TableContainer from './TableContainer';
import { Container } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// import PropTypes from "prop-types";

const App = ({data}) => {
//   const [data, setData] = useState([]);
//   useEffect(() => {
//     const doFetch = async () => {
//       const response = await fetch('https://randomuser.me/api/?results=100');
//       const body = await response.json();
//       const contacts = body.results;
//       console.log(contacts);
//       setData(contacts);
//     };
//     doFetch();
//   }, []);

      // Sampel Response
    // const sample_res_dict = [
    //   {
    //     end_time: "75.16",
    //     phrase_freq: [{go: 1, around: 1, horn: 1, rain: 1, man: 1}, 90],
    //     relative_freq: {besties: 13069427284.4, palihapitiya: 6534713642.2, freedberg: 369526.896754128, freeburg: 74599.7424820485, nondescript: 49113.9828202507},
    //     section_scores: {'Anime & Manga': 0.0261087353, 'Arts & Culture': 0.0091011942, 'Business & Finance': -0.0056585701, 'Careers': 0.025280629, 'Entertainment': 0.0151478058},
    //     section_topic: "Fashion & Beauty",
    //     segment_text: "Okay , besties are back , besties are back going around the horn. Rain man ! David sacks calling in from an undisclosed location , suffering through to code thirteen's in one lifetime. And David Freedberg is here , the queen of kin wah stacking everything in sight , Living the life , calling in from a nondescript ritz Carlton room. It appears to be. And of course the dictator himself , mammoth Palihapitiya tackling like a fool. Welcome back everybody. This is what you pay for with your subscription to the all in podcast brought to you by slack. Uh , if you didn't own slack shares , rage rand. It's been an incredible uh week on a number of levels. We're gonna talk this week about salesforce buying slack trump and section 2 30 the coin base , the ongoing coin base saga. Uh Freeburg found some interesting science that could save humanity and of course , the trust fund socialists in the new york times who hate their parents for giving the money. Uh ,",
    //     segment_text_cleaned: "besties back besties back go around horn rain man david sack call undisclosed location suffer code thirteen one lifetime david freedberg queen kin wah stack everything sight live life call nondescript ritz carlton room appear course dictator mammoth palihapitiya tackle like fool welcome back everybody pay subscription podcast bring slack slack share rage rand incredible week number level gonna talk week salesforce buy slack trump section coin base ongoing coin base saga freeburg find interest science could save humanity course trust fund socialists new york time hate parent give money",
    //     speaker: "spk_2",
    //     start_time: "0.04",
    //     top_words: ["besties", "palihapitiya", "freedberg", "freeburg", "nondescript", "salesforce", "slack", "socialists", "undisclosed", "dictator"],
    //   },
    //   {
    //     end_time: "85.57",
    //     phrase_freq: [{important: 1, thing: 1, shirt: 1, undershirt: 1, combo: 1}, 14],
    //     relative_freq: {undershirt: 506112.7118245296, combo: 3965.810737824, wear: 1407.484932189, button: 1257.5405149595, shirt: 1037.2057333009},
    //     section_scores: {'Anime & Manga': 0.115176973, 'Arts & Culture': 0.0704550897, 'Business & Finance': 0.0349749263, 'Careers': 0.0402063392, 'Entertainment': 0.0773304176},
    //     section_topic: "Fashion & Beauty",
    //     segment_text: "let's start off , let's start with off the most important thing. What is that shirt undershirt combo you're wearing ? I mean look , you have buttons on buttons , it's that",
    //     segment_text_cleaned: "let start let start important thing shirt undershirt combo wear mean look button button",
    //     speaker: "spk_0",
    //     start_time: "75.17",
    //     top_words: ["undershirt", "combo", "wear", "button", "shirt", "let", "mean", "start", "thing", "important"]
    //   },
    //   {
    //     end_time: "94.93",
    //     phrase_freq: [{school: 1, us: 1, go: 1, properly: 1, one: 1}, 11],
    //     relative_freq: {layer: 5960.0130696388, properly: 2529.4217254028, button: 1600.5061099566, school: 155.8510369455, go: 126.9711668047},
    //     section_scores: {'Anime & Manga': 0.1486375673, 'Arts & Culture': 0.1933313228, 'Business & Finance': 0.2086461647, 'Careers': 0.1866268866, 'Entertainment': 0.1538624033},
    //     section_topic: "Home & Family",
    //     segment_text: "you can't , you can school us if you're going to layer properly , you can have only one layer of buttons , but to have two layers of buttons",
    //     segment_text_cleaned: "school us go layer properly one layer button two layer button",
    //     speaker: "spk_0",
    //     start_time: "87.31",
    //     top_words: ["layer", "properly", "button", "school", "go", "two", "one", "us"],
    //   },
    // ];

    // setData(sample_res_dict);

//   const columns = useMemo(
//     () => [
//       {
//         Header: 'Title',
//         accessor: 'name.title',
//       },
//       {
//         Header: 'First Name',
//         accessor: 'name.first',
//       },
//       {
//         Header: 'Last Name',
//         accessor: 'name.last',
//       },
//       {
//         Header: 'Email',
//         accessor: 'email',
//       },
//       {
//         Header: 'City',
//         accessor: 'location.city',
//       },
//     ],
//     []
//   );

const columns = useMemo(
        () => [
      {
        Header: 'Start Time',
        accessor: 'start_time',
      },
      {
        Header: 'End Time',
        accessor: 'end_time',
      },
      {
        Header: 'Speaker',
        accessor: 'speaker',
      },
      {
        Header: 'Segment Text',
        accessor: 'segment_text',
      },
      {
        Header: 'Top Words',
        // accessor: 'top_words',
        accessor: (values) => {
            const words = values.top_words;
            // const first = Number(latitude) > 0 ? 'N' : 'S';
            // const second = Number(longitude) > 0 ? 'E' : 'W';
            // return first + '/' + second;
            return words.join(', ')
          },
      },
      {
        Header: 'Section Topic',
        accessor: 'section_topic',
      },
    ],
    []
  );

//   return <TableContainer columns={columns} data={data} />;
return (
    <Container style={{ marginTop: 100 }}>
      <TableContainer columns={columns} data={data} />
    </Container>
  )
};

export default App;