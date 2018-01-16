import React from 'react'
import Button from 'material-ui/FloatingActionButton'
import UpdateIcon from 'material-ui/svg-icons/action/update'

function Sakura({doFetchSakuraData, sakuraLists}) {
  sakuraLists.map(list => list.discs).forEach(discs => {
    discs.sort((a, b) => a.this_rank - b.this_rank)
  })
  const style = {
    position: 'fixed',
    bottom: '30px',
    right: '10px'
  }
  return (
    <div id="home">
      <Button style={style} onTouchTap={doFetchSakuraData}>
        <UpdateIcon/>
      </Button>
      {sakuraLists.map(sakuraList => (
        <table key={sakuraList.name} border="1">
          <caption>{sakuraList.title}</caption>
          <thead>
          <tr>
            <th>rank</th>
            <th>title</th>
          </tr>
          </thead>
          <tbody>
          {sakuraList.discs.map(disc => (
            <tr key={disc.asin}>
              <td>{disc.this_rank}</td>
              <td>{disc.title}</td>
            </tr>
          ))}
          </tbody>
        </table>
      ))}
    </div>
  )
}

export default Sakura
