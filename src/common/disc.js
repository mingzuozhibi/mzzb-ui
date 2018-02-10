import {Column} from '../libraries/Table'

const rank = new Column({
  className: 'rank',
  title: '日亚排名',
  style: {width: '120px'},
  format: disc => `${disc['thisRank']}位/${disc['prevRank']}位`,
})

const totalPt = new Column({
  className: 'totalPt',
  title: '累积PT',
  style: {width: '75px'},
  format: disc => `${disc['totalPt']} pt`,
})

const surplusDays = new Column({
  className: 'surplusDays',
  title: '发售日',
  style: {width: '90px'},
  format: disc => {
    const surplusDays = disc['surplusDays']
    if (surplusDays >= 0) {
      return `还有${surplusDays}天`
    } else {
      return `已售${-surplusDays}天`
    }
  },
})

const title = new Column({
  className: 'title',
  title: '碟片标题',
  format: disc => disc['title'],
})

export {rank, totalPt, surplusDays, title}
