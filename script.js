

const iplScoreElement = document.getElementById('ipl-score');

function hide(elements) {
    elements = elements.length ? elements : [elements];
    for (let element of elements) {
        element.style.display = 'none';
    }
}

//random func to hit random apis, to avoid api hit limit reached
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function getMatchData() {
    const apiKeyList = [
        '4dd70a4f-b39f-472f-bd6a-222bf1973260',
        'bef4b6e4-0fbb-4e11-9410-6e16e2ca5ab1',
        '906314c4-4490-4f3d-b126-4c2b46488afd',
        '592ceb90-a46a-4725-bd63-284825845653',
        '55664d01-3932-449b-a1f9-96bd640f6b71',
        'a8c19d53-1e77-4d72-8ae5-b43ec49cb7c8',
        'b508cccf-7a38-49b4-b013-3b87504b0c75',
        '910645dd-0bcd-4f33-9c9e-9acc7d95eb8c',
        'a3b58300-917c-42c2-852f-57768395e74b'

    ];

    const apiKey = apiKeyList[randomIntFromInterval(0, apiKeyList.length - 1)];
    // const apiKey = 'b508cccf-7a38-49b4-b013-3b87504b0c75';

    const currDate = new Date();
    const gmtDate = new Date(Date.UTC(currDate.getUTCFullYear(), currDate.getUTCMonth(), currDate.getUTCDate()));
    const tday = gmtDate.toISOString().split('T')[0];
    gmtDate.setDate(gmtDate.getDate() - 1);
    const pday = gmtDate.toISOString().split('T')[0];

    try {
        const response = await fetch(`https://api.cricapi.com/v1/cricScore?apikey=${apiKey}&offset=0`);
        const data = await response.json();
        
        if (data.status !== "success") return;

        const matchesList = data.data.filter(match => match.series === "Indian Premier League 2024");

        let team = "";
        let score1 = "";
        let score2 = "";
        let status = "";
        
        let prevTeam = "";
        let prevTeamScore1 = "";
        let prevTeamScore2 = "";
        let prevTeamStatus = "";

        const todayMatch = matchesList.find(match => match.dateTimeGMT.split('T')[0] === tday && match.status !== 'Match not started');
        const previousMatch = matchesList.find(match => match.dateTimeGMT.split('T')[0] === pday && match.status !== 'Match not started');

            if (todayMatch) {
                    // today's team 1 and 2 abbreviation 
                    const team1Abbreviation = todayMatch.t1.match(/\[(.*?)\]/)[1];
                    const team2Abbreviation = todayMatch.t2.match(/\[(.*?)\]/)[1];
                        team = `${team1Abbreviation} vs ${team2Abbreviation}`;
                        score1 = `${team1Abbreviation} = ${todayMatch.t1s}`;
                        score2 = `${team2Abbreviation} = ${todayMatch.t2s}`;
                        status = todayMatch.status;
                     }
            else if (previousMatch) {
                    // previous's team 1 and 2 abbreviation 
                    // /\[(.*?)\]/ = Reg expression to match text within square brackets

                    const team1Abbreviation = previousMatch.t1.match(/\[(.*?)\]/)[1];
                    const team2Abbreviation = previousMatch.t2.match(/\[(.*?)\]/)[1];
                        team = `${team1Abbreviation} vs ${team2Abbreviation}`;
                        score1 = `${team1Abbreviation} = ${previousMatch.t1s}`;
                        score2 = `${team2Abbreviation} = ${previousMatch.t2s}`;
                        status = previousMatch.status;
                    }

        // For second last match
        const matchesByDate = 
        matchesList.filter(match => match.status !== 'Match not started') // Filter out matches with status = 'Match not started'
                   .sort((a, b) => new Date(b.dateTimeGMT) - new Date(a.dateTimeGMT));  // Sorting matches by date in descending order
            // latest match is at 0th pos, prev match at 1th       

            if (matchesByDate.length > 1) 
            {
                const secondLastMatch = matchesByDate[1]; // Gets 2nd match(prev) from the sorted (index 1)
                const prevTeam1Abbreviation = secondLastMatch.t1.match(/\[(.*?)\]/)[1];
                const prevTeam2Abbreviation = secondLastMatch.t2.match(/\[(.*?)\]/)[1];
                    prevTeam = `${prevTeam1Abbreviation} vs ${prevTeam2Abbreviation}`;
                    prevTeamScore1 = `${prevTeam1Abbreviation} = ${secondLastMatch.t1s}`;
                    prevTeamScore2 = `${prevTeam2Abbreviation} = ${secondLastMatch.t2s}`;
                    prevTeamStatus = secondLastMatch.status;
            }


        hide(document.querySelectorAll('.loading'));
            //update ui by qselector
            iplScoreElement.querySelector('.team').textContent = team;
            iplScoreElement.querySelector('.score1').textContent = score1;
            iplScoreElement.querySelector('.score2').textContent = score2;
            iplScoreElement.querySelector('.status').textContent = status;

            
            // Handle Previous button here 
            const previousButton = iplScoreElement.querySelector('.previous');
            previousButton.addEventListener('click', () => {
                if (prevTeam) {
                    iplScoreElement.querySelector('.team').textContent = prevTeam;
                    iplScoreElement.querySelector('.score1').textContent = prevTeamScore1;
                    iplScoreElement.querySelector('.score2').textContent = prevTeamScore2;
                    iplScoreElement.querySelector('.status').textContent = prevTeamStatus;
                }
            });

        } catch (error) {
            console.error('Error fetching the IPL score:', error);
        }
}

getMatchData();

        
        const refreshButton = iplScoreElement.querySelector('.refresh');
        refreshButton.addEventListener('click', getMatchData);
