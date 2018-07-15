<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div id="app" class="container">

      <b-table :data="cores" :columns="columns" @click="rowClick"></b-table>

    </div>

  </div>
</template>

<script>
  import query from './graphql/query/allVwCoreSummaries'

  export default {
    name: 'CoreList',
    props: {
      msg: String,
    },
    data () {
      return {
        cores: [],
        columns: [
          {
            field: 'name',
            label: 'Name',
          },
          {
            field: 'location',
            label: 'Location',
          },
          {
            field: 'sampleCount',
            label: 'Sample Count',
            centered: true
          },
          {
            field: 'seriesNames',
            label: 'Series',
            centered: true
          }
        ]
      }
    },
    methods: {
      rowClick (item) {
        this.$router.push({
          path: `/core/${item.name}`
        })
      }
    },
    apollo: {
      coreSummaries: {
        query: query,
        update (data) {
          this.cores = data.allVwCoreSummaries.nodes.map(
            core => {
              const co = Object.assign(Object.assign({}, core), {
                seriesNames: core.availableSeries.reduce(
                  (acc, series) => {
                    return acc.concat([series.name])
                  }, []
                ).join(', ')
              })
              console.log('co', co)
              return co
            }
          )
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
