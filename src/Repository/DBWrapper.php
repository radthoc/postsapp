<?php
include_once __DIR__ .
    DIRECTORY_SEPARATOR .
    '..' .
    DIRECTORY_SEPARATOR .
    'Persistence' .
    DIRECTORY_SEPARATOR .
    'MYSQLHandler.php';

class DBWrapper
{
    const PROCESS = 'DBWrapper';
    private $DBHandler;
    private $operators = [
        '=',
        '!=',
        '<',
        '>',
        '<=',
        '>='
    ];

    public function __construct()
    {
        $this->DBHandler = new MYSQLHandler;
    }

    public function findAll($table, $orderBy = "''")
    {
        if (empty($table))
        {
            throw new \Exception(self::PROCESS . '- function findAll - ' . 'Parameter table is empty');
        }

        $sql = sprintf(
            "select * from %s order by %s",
            $table,
            $orderBy
        );

        return $this->DBHandler->get_results($sql, []);
    }

    public function findQuery($query, array $params = [])
    {
        if (empty($query))
        {
            throw new \Exception(self::PROCESS . '- function findQuery - ' . 'Parameter query is empty');
        }

        return $this->DBHandler->get_results($query, $params);
    }

    public function persist($table, array $data)
    {
        if (empty($table) || empty($data))
        {
            throw new \Exception(self::PROCESS . '- function persist - ' . 'One or more parameters are empty');
        }

        $result = $this->DBHandler->insert($table, $data);

        if ($result)
        {
            return $this->DBHandler->lastid();
        }

        return $result;

    }

    public function update($table, array $data, array $where, $limit = null)
    {
        $result = false;

        if (empty($table) || empty($data) || empty($where))
        {
            throw new \Exception(self::PROCESS . '- function update - ' . 'One or more parameters are empty');
        }

        if ($this->DBHandler->update($table, $data, $where, $limit))
        {
            $result = $this->DBHandler->affected() > 0;
        }

        return $result;
    }

    public function lastID()
    {
        return $this->DBHandler->lastid();
    }
}