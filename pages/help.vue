<script>
export default {
  auth: false,

  data () {
    return {
      expanded: [],
      faqHeaders: [
        {
          text: 'Question',
          value: 'question'
        }
      ]
    }
  }
}
</script>

<template>
  <v-container fluid>
    <v-row class="first-row">
      <v-col cols="8">
        <div class="first-col">
          <p class="p-1">
            {{ $t('pages.help.title') }}
          </p>
          <h1 class="h1-1">
            {{ $t('pages.help.subtitle') }}
          </h1>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="second-col">
          <h1>{{ $t('pages.help.faq') }}</h1>
          <p>{{ $t('pages.help.faqExtended') }}</p>
          <v-data-table
            class="faq-table elevation-1"
            :headers="faqHeaders"
            :items="$t('pages.help.faqList.demoAccount')"
            single-expand
            :expanded.sync="expanded"
            item-key="id"
            show-expand
            hide-default-header
            hide-default-footer
            @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
          >
            <template #expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                {{ item.answer }}
              </td>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="third-col text-center">
          <v-card>
            <img
              height="180"
              src="@/assets/images/logo/2.png"
            >
            <v-card-subtitle>
              {{ $t('pages.help.footer') }} <a href="mailto:info@dataelementhub.de">info@dataelementhub.de</a>.
            </v-card-subtitle>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss">

.third-col {
  padding-top: 10rem;
  width: 50%;
  margin: 0 auto;
}

.second-col {
  width: 50%;
  margin: 0 auto;
}

.first-col {
  padding-top: 5vh;
  padding-left: 5vw;
  width: 100%;
  margin: 0 auto;
}

.p-1 {
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.3rem;
  margin-bottom: 2rem;
}

.h1-1 {
  color: white;
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.025rem;
  line-height: 3.6rem;
}

.first-row {
  position: relative;
  font-family: "Lato", sans-serif;
  height: 40vh;
  background-image: linear-gradient(to right bottom, rgba(172, 206, 248, 0.81), rgba(6, 130, 196, 0.73));
  background-size: cover;
  background-position: top;
  -webkit-clip-path: polygon(0 0, 100% 0, 100% 60%, 0 100%);
  clip-path: polygon(0 0, 100% 0, 100% 60%, 0 100%);
}
</style>
