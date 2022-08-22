import { getDataBaseConnection } from 'db';
import { Article } from 'db/entity';
import { IArticle } from './api';
import ListItem from 'components/ListItem';

interface IProps {
  articles: IArticle[];
}

export async function getServerSideProps() {
  const db = await getDataBaseConnection();
  const articles = await db.getRepository(Article).find({
    relations: {
      user: true,
    },
  });

  console.log(articles);

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
    },
  };
}

const Home = (props: IProps) => {
  const { articles } = props;
  return (
    <div>
      {articles.map((article) => (
        <ListItem key={article.id} article={article} />
      ))}
    </div>
  );
};

export default Home;
