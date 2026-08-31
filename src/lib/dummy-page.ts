import type { Page } from './microcms';

export const dummyPages: Record<string, Page> = {
  home: {
    id: 'home',
    slug: 'home',
    metaTitle: '東京・渋谷のローフード×発酵料理教室 | &LAB TOKYO',
    metaDescription:
      '東京・渋谷発のローフード×発酵専門料理教室。ローチョコレート・ロースイーツ・発酵プランナーなど本格資格講座を開講。ELLE gourmet認定料理家・安藤千英主宰。',
    blocks: [
      {
        fieldId: 'hero',
        eyebrow: '東京・渋谷 / ELLE gourmet 認定料理家 主宰',
        mainCopy: '発酵とローフードで、\n身体を再設計する。',
        accentWord: '再設計',
        subCopy:
          '酵素と微生物の力を借りて、腸から、細胞から、ほんとうの美しさを育む。',
        ctaLabel: '講座を詳しく見る',
        ctaUrl: '/alllesson',
        ctaLabel2: '個別相談・お問い合わせ',
        ctaUrl2: '/contact',
        videoUrl: '/hero-video.mp4',
      },
      {
        fieldId: 'conceptBand',
        catchcopy: '発酵とローフードの交差点で、\n食の哲学を育てる。',
        leadText: '酵素が生きている食材と、微生物の叡智。ふたつの力が交わるとき、身体は本来の知性を取り戻す。',
      },
      {
        fieldId: 'courseGrid',
        label: 'COURSES',
        heading: 'ジャンルから講座を選ぶ',
        items: [
          {
            fieldId: 'courseItem',
            cat: 'Raw Chocolate',
            name: 'ローチョコレートマイスター',
            url: '/rawchocolatemeister',
            theme: 'choco',
          },
          {
            fieldId: 'courseItem',
            cat: 'Fermentation',
            name: '発酵プランナー',
            url: '/fermentation',
            theme: 'ferm',
          },
          {
            fieldId: 'courseItem',
            cat: 'Raw Food & Patisserie',
            name: 'ローパティシエ',
            url: '/rawfood',
            theme: 'raw',
          },
          {
            fieldId: 'courseItem',
            cat: 'Workshop',
            name: '体験レッスン',
            url: '/experiencelessons',
            theme: 'workshop',
          },
        ],
      },
      {
        fieldId: 'knowledgeGrid',
        label: 'KNOWLEDGE',
        heading: 'ローフード・発酵の知識',
        count: 3,
      },
      {
        fieldId: 'knowledgeArea',
        title: 'KNOWLEDGE',
        subtitle: 'ローフード・発酵の知識',
      },
      {
        fieldId: 'sliderArea',
        slides: [
          {
            fieldId: 'sliderItem',
            title: 'ローチョコレートで、\n身体の知性を目覚めさせる。',
            text: 'カカオ本来の酵素と栄養を損なわない、48℃以下の製法。',
            url: '/rawchocolatemeister',
          },
          {
            fieldId: 'sliderItem',
            title: '発酵の叡智が、\n細胞を再設計する。',
            text: '微生物の働きを借りて、腸から、免疫から、本来の健康を取り戻す。',
            url: '/fermentation',
          },
          {
            fieldId: 'sliderItem',
            title: 'ローパティシエの技術で、\n美しさを食べる。',
            text: '砂糖・乳製品・グルテンフリー。素材の力だけで生まれる本物の甘さ。',
            url: '/rawfood',
          },
        ],
      },
      {
        fieldId: 'journalArea',
        title: 'JOURNAL',
        subtitle: 'レシピ & コラム',
      },
      {
        fieldId: 'profileBand',
        label: 'ABOUT',
        name: '安藤 千英',
        nameEn: 'Chie Ando',
        subText: 'ELLE gourmet 認定料理家 / &LAB TOKYO 主宰',
        description:
          '発酵×ローフードのクロス理論を独自開発。東京・渋谷のスタジオで、腸から、細胞から整うライフスタイルを伝える。著書「発酵ローフード」。ローチョコレートマイスター®・ローパティシエ®・発酵創家® 各協会代表。',
        ctaLabel: 'プロフィールを見る',
        ctaUrl: '/about',
      },
    ],
  },
};
