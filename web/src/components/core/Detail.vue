<template>
  <div>
    <router-link :to="{ path: '/' }">home</router-link>
    <h1>{{ name }}</h1>
    <!--<p>{{rows}}</p>-->
    <div v-if="$apollo.loading">Loading...</div>
    <div :max-width="400" :max-height="400">
      <core-chart :chartData="chartData"></core-chart>
    </div>
    <!--<div id="app" class="container">-->
      <!--<b-table :data="rows" :columns="columns"></b-table>-->
    <!--</div>-->

  </div>
</template>

<script>
  import coreDetail from './graphql/query/coreDetail'
  import CoreChart from './CoreChart'

  export default {
    components: {
      CoreChart
    },
    name: 'CoreDetail',
    params: {
      name: String,
    },
    data () {
      return {
        name: this.$route.params.name,
        rows: [],
        columns: [],
        chartData: {
          labels: [],
          datasets: []
        }
      }
    },
    apollo: {
      coreSummaries: {
        query: coreDetail,
        variables() {
          return {
            name: this.$route.params.name
          }
        },
        update (data) {
          // console.log('data', data.coreByName)
          const dataPointColumns = data.coreByName.samples.nodes[0].dataPoints.nodes.reduce(
            (acc, dp) => {
              return acc.concat([{
                field: dp.dataPointType.name,
                label: dp.dataPointType.name,
              }])
            }, []
          )

          this.columns = [].concat([
            {
              field: 'topDepth',
              label: 'topDepth',
            },
            {
              field: 'topAge',
              label: 'topAge',
            }
          ]).concat(dataPointColumns)

          this.rows = data.coreByName.samples.nodes.reduce(
            (acc, s) => {

              const dataPoints = s.dataPoints.nodes.reduce(
                (acc, dp) => {
                  return Object.assign(acc, {
                    [dp.dataPointType.name]: dp.value
                  })
                }, {}
              )

              return acc.concat([
                Object.assign({
                  topDepth: s.topDepth,
                  topAge: s.topAge
                }, dataPoints)
              ])
            }, []
          )

          const datasetKeys = Object.keys(this.rows[0]).filter(k => ['topDepth', 'topAge'].includes(k) === false)

          const datasets = datasetKeys.map(
            key => {
              return {
                label: key,
                data: []
              }
            }
          )

          this.chartData = this.rows.reduce(
            (cd, row) => {
              const labels = cd.labels.concat([row.topDepth])
              const datasets = datasetKeys.reduce(
                (acc, key) => {
                  // console.log('cd.datasets', cd.datasets)
                  const dataset = cd.datasets.find(ds => ds.label === key)
                  // console.log('dataset', dataset)
                  return acc.concat({
                    label: dataset.label,
                    data: dataset.data.concat([row[key]])
                  })
                }, []
              )

              return {
                labels: labels,
                datasets: datasets
              }
            }, {
              labels: [],
              datasets: datasets
            }
          )

          console.log('this.rows', this.rows)
          console.log('this.chartData', this.chartData)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
