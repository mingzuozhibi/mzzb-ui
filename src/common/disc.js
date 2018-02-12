import {Table} from '../libraries'

const {Column} = Table

export type DiscColumn = 'id' | 'asin' | 'title' | 'thisRank' | 'prevRank' | 'totalPt' | 'surplusDays'

export type DiscType = 'Cd' | 'Dvd' | 'Bluray' | 'Box' | 'Other'

export type UpdateType = 'Sakura' | 'Amazon' | 'Both' | 'None'

export interface Disc {
  id?: number;
  asin?: string;
  title?: string;
  titlePc?: string;
  titleMo?: string;
  thisRank?: number;
  prevRank?: number;
  nicoBook?: number;
  totalPt?: number;
  discType?: DiscType;
  updateType?: UpdateType;
  releaseDate?: string;
  createDate?: string;
  modifyDate?: string;
  modifyUser?: string;
  surplusDays?: number;
}

const rank = new Column({
  className: 'rank',
  title: '日亚排名',
  style: {width: '120px'},
  format: (disc: Disc) => `${disc.thisRank}位/${disc.prevRank}位`,
})

const totalPt = new Column({
  className: 'totalPt',
  title: '累积PT',
  style: {width: '75px'},
  format: (disc: Disc) => `${disc.totalPt} pt`,
})

const surplusDays = new Column({
  className: 'surplusDays',
  title: '发售日',
  style: {width: '90px'},
  format: (disc: Disc) => {
    const surplusDays = disc.surplusDays
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
  format: (disc: Disc) => disc.title,
})

export const discColumns = {rank, totalPt, surplusDays, title}
