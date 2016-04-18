<?php
include_once 'DBHandlerInterface.php';

class MYSQLHandler implements DBHandlerInterface
{
    const PROCESS = 'MYSQLiHandler';

    private $conn = null;
    private $params = [
        'host' => '127.0.0.1',
        'usr' => 'root',
        'pwd' => 'lowmorale',
        'schema' => 'posts_site'
    ];

    public function __construct()
    {
        mb_internal_encoding('UTF-8');
        mb_regex_encoding('UTF-8');

        try {
            $this->conn = new PDO(
                'mysql: host=' . $this->params['host'] .
                ';dbname=' . $this->params['schema'] .
                ';port=3306' .
                ';charset=utf8',
                $this->params['usr'],
                $this->params['pwd']
            );
        } catch (PDOException $e) {
            throw new Exception('Unable to connect to database - ' . $e->getMessage());
        }

        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function __destruct()
    {
        if ($this->conn) {
            $this->disconnect();
        }
    }

    public function get_row($query, $params = [])
    {
        if (empty($query)) {
            throw new Exception(self::PROCESS . '- function get_results - ' . 'Parameter query is empty');
        }

        $statement = $this->conn->prepare($query);

        if ($statement->execute($params)) {
            $result = $statement->fetch(PDO::FETCH_ASSOC);
            $statement = null;

            return $result;
        } else {
            throw new Exception('Error - ' . $statement->errorCode());
        }
    }

    public function get_results($query, $params = [])
    {
        if (empty($query)) {
            throw new Exception(self::PROCESS . '- function get_results - ' . 'Parameter query is empty');
        }

        $statement = $this->conn->prepare($query);

        if ($statement->execute($params)) {
            $result = $statement->fetchAll(PDO::FETCH_ASSOC);

            $statement = null;
            return $result;
        } else {
            throw new Exception('Error - ' . $statement->errorCode());
        }
    }

    public function insert($query, $params)
    {
        if (empty($query) || empty($params)) {
            throw new \Exception(self::PROCESS . '- function insert - ' . 'One ore more parameters are empty');
        }

        $statement = $this->conn->prepare($query);

        if ($statement->execute($params)) {
            $statement = null;
            return true;
        } else {
            throw new Exception('Error - ' . $statement->errorCode());
        }

    }

    public function update($table, $variables, $where, $limit = '')
    {
        if (empty($table) || empty($variables) || empty($where)) {
            throw new \Exception(self::PROCESS . '- function update - ' . 'One or more parameters are empty');
        }

        $variables = $this->sanitize($variables);

        $query = "UPDATE " . $table . " SET ";

        foreach ($variables as $field => $value) {
            $updates[] = "`$field` = '$value'";
        }

        $query .= implode(', ', $updates);

        if (!empty($where)) {
            foreach ($where as $field => $value) {
                $value = $value;
                $clause[] = "$field = '$value'";
            }
            $query .= ' WHERE ' . implode(' AND ', $clause);
        }

        if (!empty($limit)) {
            $query .= ' LIMIT ' . $limit;
        }

        $query = $this->conn->query($query);

        if ($this->conn->error) {
            throw new \Exception(self::PROCESS . '- function update - ' . $this->conn->error);
        }

        return true;
    }

    public function lastId()
    {
        return $this->conn->lastInsertId();
        ;
    }

    public function affected()
    {
        return $this->conn->affected_rows;
    }

    private function escape($data)
    {
        if (!is_array($data)) {
            $data = addslashes($data);
        } else {
            $data = array_map([$this, 'escape'], $data);
        }

        return $data;
    }

    private function cleanToSend($data)
    {
        $data = stripslashes($data);
        $data = html_entity_decode($data, ENT_QUOTES, 'UTF-8');
        $data = nl2br($data);
        $data = urldecode($data);

        return $data;
    }

    private function disconnect()
    {
        $this->conn = null;
    }
}
