<?php
include_once 'DBHandler.php';

class MYSQLHandler implements DBHandler
{
    const PROCESS = 'MYSQLiHandler';

    private $conn = null;
    private $params = [
        'host' => '127.0.0.1',
        'usr' => 'root',
        'pwd' => 'lowmorale',
        'schema' => 'comments_site'
    ];

    public function __construct()
    {
        mb_internal_encoding('UTF-8');
        mb_regex_encoding('UTF-8');

        try
        {
            $this->conn = new PDO(
                'mysql: host=' . $this->params['host'] .
                ';dbname=' . $this->params['schema'] .
                ';port=3306' .
                ';charset=utf8',
                $this->params['usr'],
                $this->params['pwd']
            );
        } catch (PDOException $e)
        {
            die('Unable to connect to database - ' . $e->getMessage());
        }
    }

    public function __destruct()
    {
        if ($this->conn)
        {
            $this->disconnect();
        }
    }

    public function get_results($query, $params = [], $object = false)
    {
        if (empty($query))
        {
            throw new \Exception(self::PROCESS . '- function get_results - ' . 'Parameter query is empty');
        }

        $statement = $this->conn->prepare($query);
        $statement->execute($params);

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        $statement = null;

        return $result;
    }

    public function insert($table, $variables)
    {
        if (empty($table) || empty($variables))
        {
            throw new \Exception(self::PROCESS . '- function insert - ' . 'One ore more parameters are empty');
        }

        $variables = $this->sanitize($variables);

        $sql = "INSERT INTO " . $table;

        $fields = [];
        $values = [];

        foreach ($variables as $field => $value)
        {
            $fields[] = $field;
            $values[] = "'" . $value . "'";
        }

        $fields = ' (' . implode(', ', $fields) . ')';
        $values = '(' . implode(', ', $values) . ')';

        $sql .= $fields . ' VALUES ' . $values;

        $query = $this->conn->query($sql);

        if ($this->conn->error)
        {
            throw new \Exception(self::PROCESS . '- function insert - ' . $this->conn->error);
        }
        else
        {
            return true;
        }
    }

    public function update($table, $variables, $where, $limit = '')
    {
        if (empty($table) || empty($variables) || empty($where))
        {
            throw new \Exception(self::PROCESS . '- function update - ' . 'One or more parameters are empty');
        }

        $variables = $this->sanitize($variables);

        $sql = "UPDATE " . $table . " SET ";

        foreach ($variables as $field => $value)
        {
            $updates[] = "`$field` = '$value'";
        }

        $sql .= implode(', ', $updates);

        if (!empty($where))
        {
            foreach ($where as $field => $value)
            {
                $value = $value;
                $clause[] = "$field = '$value'";
            }
            $sql .= ' WHERE ' . implode(' AND ', $clause);
        }

        if (!empty($limit))
        {
            $sql .= ' LIMIT ' . $limit;
        }

        $query = $this->conn->query($sql);

        if ($this->conn->error)
        {
            throw new \Exception(self::PROCESS . '- function update - ' . $this->conn->error);
        }

        return true;

    }

    public function lastid()
    {
        return $this->conn->insert_id;
    }

    public function affected()
    {
        return $this->conn->affected_rows;
    }

    private function setStatement($query, $params)
    {
        try
        {
            $stmt = $this->conn->prepare($query);
            $ref = new \ReflectionClass('mysqli_stmt');

            if (count($params) != 0)
            {
                $method = $ref->getMethod('bind_param');
                $method->invokeArgs($stmt, $params);
            }
        } catch (Exception $e)
        {
            if ($stmt != null)
            {
                $stmt->close();
            }
        }

        return $stmt;
    }

    private function sanitize($data)
    {
        if (!is_array($data))
        {
            //$data = str_replace(["\n", "\r"], "", $data);
            $data = str_replace(PHP_EOL, "", $data);
            $data = $this->conn->real_escape_string($data);
        }
        else
        {
            $data = array_map([$this, 'sanitize'], $data);
        }

        return $data;
    }

    private function escape($data)
    {
        if (!is_array($data))
        {
            $data = addslashes($data);
        }
        else
        {
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