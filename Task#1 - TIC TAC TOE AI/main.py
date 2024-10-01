import math

def check_winner(board):
    """
    Checks if there's a winner on the board.

    Args:
        board (list): A list representing the game board with 9 elements.

    Returns:
        str or None: The symbol ('X' or 'O') of the winner if there is one, otherwise None.
    """
    win_combinations = [(0, 1, 2), (3, 4, 5), (6, 7, 8),
                         (0, 3, 6), (1, 4, 7), (2, 5, 8),
                         (0, 4, 8), (2, 4, 6)]
    for combo in win_combinations:
        if board[combo[0]] == board[combo[1]] == board[combo[2]] != ' ':
            return board[combo[0]]
    return None

def minimax(board, depth, is_maximizing):
    """
    Implements the Minimax algorithm to determine the optimal move for a player.

    Args:
        board (list): The current state of the game board as a list.
        depth (int): The depth of the search tree.
        is_maximizing (bool): A boolean indicating whether the current move is for the maximizing player.

    Returns:
        int: The best score for the current player (10 for 'O' win, -10 for 'X' win, 0 for draw).
    """
    if depth == 0 or check_winner(board) is not None:
        if check_winner(board) == 'O':
            return 10
        elif check_winner(board) == 'X':
            return -10
        else:
            return 0

    if is_maximizing:
        best_score = -math.inf
        for i in range(len(board)):
            if board[i] == ' ':
                board[i] = 'O'
                score = minimax(board, depth - 1, not is_maximizing)
                board[i] = ' '
                best_score = max(best_score, score)
        return best_score

    else:
        best_score = math.inf
        for i in range(len(board)):
            if board[i] == ' ':
                board[i] = 'X'
                score = minimax(board, depth - 1, not is_maximizing)
                board[i] = ' '
                best_score = min(best_score, score)
        return best_score

def best_move(board):
    """
    Finds the best move for the AI using the [minimax algorithm](https://en.wikipedia.org/wiki/Minimax).

    Args:
        board (list): The current state of the game board as a list of characters.
                      Each element can be 'X', 'O', or ' ' (empty space).

    Returns:
        int: The index of the best move for the AI on the board.
    """
    best_val = -math.inf
    best_move_idx = -1
    for i in range(len(board)):
        if board[i] == ' ':
            board[i] = 'O'
            move_val = minimax(board, 0, False)
            board[i] = ' '
            if move_val > best_val:
                best_move_idx = i
                best_val = move_val
    return best_move_idx

def play_game():
    """Main game loop."""
    board = [' ' for _ in range(9)]
    current_player = 'X'

    while True:
        if current_player == 'X':
            move = int(input("Enter your move (0-8): "))
            if board[move] == ' ':
                board[move] = current_player
            else:
                print("Invalid move. Try again.")
                continue
        else:
            move = best_move(board)
            board[move] = current_player

        print_board(board)

        winner = check_winner(board)
        if winner is not None:
            print(f"{winner} wins!")
            break

        if ' ' not in board:
            print("It's a tie!")
            break

        current_player = 'O' if current_player == 'X' else 'X'

def print_board(board):
    """Prints the current state of the board."""
    for i in range(0, 9, 3):
        print(board[i], board[i+1], board[i+2])
    print("------------------")
if __name__ == "__main__":
    play_game()