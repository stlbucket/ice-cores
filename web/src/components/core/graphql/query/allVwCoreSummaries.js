import gql from 'graphql-tag'

const query = gql`
query AllVwCoreSummaries {
  allVwCoreSummaries {
    nodes {
      id
      name
      location
      sampleCount
      availableSeries
    }
  }
}
`

export default query