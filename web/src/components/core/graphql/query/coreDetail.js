import gql from 'graphql-tag'

const query = gql`
query	CoreByName(
  $name: String!
){
  coreByName(name: $name) {
    id
    samples: samplesByCoreId {
      nodes {
        topAge
        topDepth
        dataPoints: dataPointsBySampleId {
          nodes {
            dataPointType: dataPointTypeByDataPointTypeId {
              name
            }
            value
          }
        }
      }
    }
    # series: seriesByCoreId {
    #   nodes {
    #     id
    #     name
    #     dataPointType: dataPointTypeByDataPointTypeId {
    #       id
    #       name
    #     }
    #     dataPoints: dataPointsBySeriesId {
    #       nodes {
    #         value
    #         sample: sampleBySampleId {
    #           topAge
    #           topDepth
    #         }
    #       }
    #     }
    #   }
    # }
  }
}
`

export default query